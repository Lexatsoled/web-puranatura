# TASK-004: Migrar Checkout a Backend

**Prioridad**: 🔴 CRÍTICA  
**Tiempo estimado**: 8-10 horas  
**Dependencias**: Ninguna (puede ejecutarse en paralelo con TASK-001 a TASK-003)  
**Asignado a**: GPT-5-codex  
**Revisor**: GitHub Copilot

---

## 📋 CONTEXTO

**PROBLEMA CRÍTICO ACTUAL**:

El checkout guarda pedidos completos en `localStorage` incluyendo:
- Información personal (PII): nombres, direcciones, teléfonos
- Métodos de pago (números de tarjeta parciales)
- Historial completo de pedidos

**Ubicación del problema**: `src/store/checkoutStore.ts` línea 147-157

```typescript
// ACTUAL (INSEGURO):
localStorage.setItem('pureza-naturalis-orders', JSON.stringify(existingOrders));
```

Esto viola:
- ❌ GDPR (datos personales sin cifrar)
- ❌ PCI-DSS (datos de pago en cliente)
- ❌ Mejores prácticas de seguridad

### Hallazgo relacionado

- **ID**: SEC-CHECKOUT-002
- **Severidad**: CRÍTICA
- **Impacto**: Exposición de PII en navegadores compartidos

---

## 🎯 OBJETIVO

Migrar la creación y almacenamiento de pedidos al backend:

1. ✅ Crear schema Drizzle para `orders` y `order_items`
2. ✅ Implementar endpoint POST `/api/orders`
3. ✅ Actualizar `checkoutStore.ts` para usar API
4. ✅ Eliminar completamente localStorage de pedidos
5. ✅ Mantener UX actual (no cambios visibles para usuario)

---

## 📁 PARTE 1: SCHEMA DE BASE DE DATOS

### 1. `backend/src/db/schema/orders.ts` (NUEVO)

**Ubicación**: Crear archivo nuevo  
**Propósito**: Definir schema Drizzle para órdenes

```typescript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

/**
 * Tabla principal de órdenes
 */
export const orders = sqliteTable('orders', {
  // Identificador único de la orden
  id: text('id')
    .primaryKey()
    .$defaultFn(() => `ORD-${Date.now()}-${createId()}`),
  
  // ID del usuario (opcional, puede ser null para guests)
  userId: text('user_id'),
  
  // Información de envío (JSON)
  shippingAddress: text('shipping_address', { mode: 'json' })
    .$type<{
      firstName: string;
      lastName: string;
      company?: string;
      street: string;
      apartment?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone: string;
    }>()
    .notNull(),
  
  // Método de pago (solo tipo, NO detalles de tarjeta)
  paymentMethod: text('payment_method', { mode: 'json' })
    .$type<{
      type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash_on_delivery';
      // NO guardar cardNumber, expiryDate, etc.
    }>()
    .notNull(),
  
  // Notas del pedido
  orderNotes: text('order_notes'),
  
  // Resumen de costos
  subtotal: real('subtotal').notNull(),
  shipping: real('shipping').notNull(),
  tax: real('tax').notNull(),
  discount: real('discount').default(0),
  total: real('total').notNull(),
  
  // Estado del pedido
  status: text('status', {
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
  })
    .notNull()
    .default('pending'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Tabla de items de la orden (detalle)
 */
export const orderItems = sqliteTable('order_items', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  
  // Relación con orden
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  
  // Información del producto
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  productImage: text('product_image'),
  
  // Variante seleccionada (si aplica)
  variantId: text('variant_id'),
  variantName: text('variant_name'),
  
  // Precio y cantidad
  price: real('price').notNull(),
  quantity: integer('quantity').notNull(),
  subtotal: real('subtotal').notNull(), // price * quantity
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Tipos TypeScript inferidos
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
```

---

### 2. Actualizar `backend/src/db/schema/index.ts`

**Modificación**: Exportar nuevos schemas

```typescript
// ... exports existentes ...
export * from './orders';
```

---

## 📁 PARTE 2: MIGRACIÓN DE BASE DE DATOS

### 3. Crear migración

```bash
cd backend
npx drizzle-kit generate:sqlite --schema=./src/db/schema
```

Esto genera:
- `backend/drizzle/[timestamp]_create_orders.sql`

**Verificar que contiene**:
```sql
CREATE TABLE `orders` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text,
  `shipping_address` text NOT NULL,
  `payment_method` text NOT NULL,
  `order_notes` text,
  `subtotal` real NOT NULL,
  `shipping` real NOT NULL,
  `tax` real NOT NULL,
  `discount` real DEFAULT 0,
  `total` real NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE `order_items` (
  `id` text PRIMARY KEY NOT NULL,
  `order_id` text NOT NULL,
  `product_id` text NOT NULL,
  `product_name` text NOT NULL,
  `product_image` text,
  `variant_id` text,
  `variant_name` text,
  `price` real NOT NULL,
  `quantity` integer NOT NULL,
  `subtotal` real NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
```

### 4. Aplicar migración

```bash
cd backend
npx drizzle-kit push:sqlite
```

---

## 📁 PARTE 3: ENDPOINT DE BACKEND

### 5. `backend/src/routes/orders.ts` (NUEVO)

```typescript
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/client';
import { orders, orderItems, type NewOrder, type NewOrderItem } from '../db/schema/orders';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';

// Schemas de validación
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    productImage: z.string().optional(),
    variantId: z.string().optional(),
    variantName: z.string().optional(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
  })).min(1),
  
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    company: z.string().optional(),
    street: z.string().min(1),
    apartment: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(1),
  }),
  
  paymentMethod: z.object({
    type: z.enum(['credit_card', 'debit_card', 'bank_transfer', 'cash_on_delivery']),
  }),
  
  orderNotes: z.string().optional(),
  
  summary: z.object({
    subtotal: z.number().nonnegative(),
    shipping: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    discount: z.number().nonnegative().optional(),
    total: z.number().positive(),
  }),
});

export async function orderRoutes(app: FastifyInstance) {
  
  // POST /api/orders - Crear nuevo pedido
  app.post('/orders', {
    preHandler: validate(createOrderSchema),
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as z.infer<typeof createOrderSchema>;
      
      // Validar que el total calculado coincide
      const calculatedTotal = body.summary.subtotal + body.summary.shipping + body.summary.tax - (body.summary.discount || 0);
      if (Math.abs(calculatedTotal - body.summary.total) > 0.01) {
        return reply.status(400).send({
          error: 'Validación fallida',
          message: 'El total calculado no coincide con el enviado'
        });
      }
      
      // Obtener userId si está autenticado (opcional)
      const userId = (request as any).user?.userId || null;
      
      // Crear orden en transacción
      const [order] = await db.insert(orders).values({
        userId,
        shippingAddress: body.shippingAddress,
        paymentMethod: body.paymentMethod,
        orderNotes: body.orderNotes || null,
        subtotal: body.summary.subtotal,
        shipping: body.summary.shipping,
        tax: body.summary.tax,
        discount: body.summary.discount || 0,
        total: body.summary.total,
        status: 'pending',
      }).returning();
      
      // Crear items de la orden
      const items = body.items.map(item => ({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage || null,
        variantId: item.variantId || null,
        variantName: item.variantName || null,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));
      
      await db.insert(orderItems).values(items);
      
      // Retornar orden creada
      return reply.status(201).send({
        success: true,
        orderId: order.id,
        order: {
          ...order,
          items,
        },
      });
      
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({
        error: 'Error interno',
        message: 'No se pudo procesar el pedido',
      });
    }
  });
  
  // GET /api/orders/:orderId - Obtener orden específica
  app.get('/orders/:orderId', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { orderId } = request.params as { orderId: string };
      
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);
      
      if (!order) {
        return reply.status(404).send({
          error: 'No encontrado',
          message: 'Orden no existe',
        });
      }
      
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));
      
      return reply.send({
        order: {
          ...order,
          items,
        },
      });
      
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({
        error: 'Error interno',
        message: 'No se pudo obtener la orden',
      });
    }
  });
  
  // GET /api/orders - Listar órdenes del usuario autenticado
  app.get('/orders', {
    preHandler: requireAuth,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.userId;
      
      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));
      
      return reply.send({
        orders: userOrders,
      });
      
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({
        error: 'Error interno',
        message: 'No se pudieron obtener las órdenes',
      });
    }
  });
}
```

---

### 6. Registrar rutas en `backend/src/index.ts`

**Modificación**: Añadir después de las rutas de productos

```typescript
// ... código existente ...

const { orderRoutes } = await import('./routes/orders.js');
await app.register(orderRoutes, { prefix: '/api' });

// ... resto del código ...
```

---

## 📁 PARTE 4: ACTUALIZAR FRONTEND

### 7. Modificar `src/store/checkoutStore.ts`

**CAMBIO CRÍTICO**: Reemplazar `processOrder` function

**ANTES** (líneas 140-180 aproximadamente):
```typescript
processOrder: async (cart) => {
  // ... código que guarda en localStorage ...
  localStorage.setItem('pureza-naturalis-orders', JSON.stringify(existingOrders));
  // ...
}
```

**DESPUÉS**:
```typescript
processOrder: async (cart) => {
  set({ isProcessing: true });

  try {
    // Validaciones (mantener las existentes)
    const { shippingAddress, paymentMethod, agreedToTerms } = get();

    if (!shippingAddress) {
      throw new Error('Dirección de envío requerida');
    }

    if (!paymentMethod) {
      throw new Error('Método de pago requerido');
    }

    if (!agreedToTerms) {
      throw new Error('Debe aceptar los términos y condiciones');
    }

    if (cart.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Preparar datos para API
    const orderData = {
      items: cart.items.map(item => ({
        productId: item.productId,
        productName: item.name,
        productImage: item.image,
        variantId: item.variantId,
        variantName: item.variantName,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod: {
        type: paymentMethod.type,
        // NO enviar cardNumber, expiryDate, etc.
      },
      orderNotes: get().orderNotes,
      summary: get().orderSummary,
    };

    // Llamar al backend
    const response = await fetch('http://localhost:3001/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante para cookies
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al procesar el pedido');
    }

    const result = await response.json();
    const orderId = result.orderId;

    // ✅ NO guardar en localStorage
    // ✅ Limpiar cualquier dato existente
    try {
      localStorage.removeItem('pureza-naturalis-orders');
    } catch {
      // Ignorar errores de localStorage
    }

    showSuccessNotification(`¡Pedido #${orderId} realizado con éxito!`);

    set({ isProcessing: false });
    return { success: true, orderId };
    
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error al procesar el pedido';
    showErrorNotification(errorMessage);
    set({ isProcessing: false });
    return { success: false, error: errorMessage };
  }
},
```

---

### 8. Actualizar `src/services/orderService.ts`

**Modificar** el método `placeOrder` para usar endpoint real:

```typescript
async placeOrder(orderData: CreateOrderData): Promise<OrderResponse> {
  try {
    // Validar datos
    this.validateOrderData(orderData);

    // Llamar a API REAL (ya no mock)
    const response = await axios.post<OrderResponse>(
      `${import.meta.env.VITE_API_URL}/orders`,
      orderData,
      {
        withCredentials: true, // Importante para auth
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to place order');
    }
    throw new Error('Failed to place order. Please try again.');
  }
}
```

---

## 🧪 TESTS Y VALIDACIÓN

### Test 1: Crear orden vía API

```bash
# Backend debe estar corriendo
cd backend
npm run dev

# En otra terminal, probar endpoint
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "productId": "test-123",
      "productName": "Producto Test",
      "price": 100,
      "quantity": 1
    }],
    "shippingAddress": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "street": "Calle 123",
      "city": "Santo Domingo",
      "state": "DN",
      "postalCode": "10101",
      "country": "DO",
      "phone": "809-555-1234"
    },
    "paymentMethod": {
      "type": "cash_on_delivery"
    },
    "summary": {
      "subtotal": 100,
      "shipping": 0,
      "tax": 18,
      "discount": 0,
      "total": 118
    }
  }'

# Debe retornar 201 Created con orderId
```

### Test 2: Verificar localStorage limpio

```javascript
// En DevTools Console del navegador, después de checkout:
localStorage.getItem('pureza-naturalis-orders'); // Debe retornar null
```

### Test 3: Verificar orden en DB

```bash
cd backend
npx drizzle-kit studio

# Abrir http://localhost:4983
# Navegar a tabla 'orders'
# Verificar que la orden existe
```

### Test 4: E2E checkout completo

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('checkout crea orden en backend sin guardar en localStorage', async ({ page }) => {
  // 1. Ir a tienda y añadir producto
  await page.goto('http://localhost:3000/tienda');
  await page.click('[data-testid="add-to-cart-btn"]');
  
  // 2. Ir a checkout
  await page.goto('http://localhost:3000/checkout');
  
  // 3. Llenar formulario de envío
  await page.fill('[name="firstName"]', 'Test');
  await page.fill('[name="lastName"]', 'User');
  await page.fill('[name="street"]', 'Test Street');
  await page.fill('[name="city"]', 'Test City');
  await page.fill('[name="state"]', 'TC');
  await page.fill('[name="postalCode"]', '12345');
  await page.fill('[name="country"]', 'DO');
  await page.fill('[name="phone"]', '809-555-0000');
  await page.click('[data-testid="next-step"]');
  
  // 4. Seleccionar método de pago
  await page.click('[data-testid="payment-cash"]');
  await page.click('[data-testid="next-step"]');
  
  // 5. Confirmar pedido
  await page.check('[data-testid="agree-terms"]');
  await page.click('[data-testid="place-order"]');
  
  // 6. Esperar confirmación
  await expect(page.locator('text=/Pedido #ORD-/')).toBeVisible();
  
  // 7. Verificar localStorage limpio
  const localStorageOrders = await page.evaluate(() => {
    return localStorage.getItem('pureza-naturalis-orders');
  });
  expect(localStorageOrders).toBeNull();
  
  // 8. Verificar que hay una orden en la DB (via API)
  const response = await page.request.get('http://localhost:3001/api/orders');
  expect(response.status()).toBe(200); // Si está autenticado
});
```

---

## ✅ CHECKLIST DE VALIDACIÓN

**Backend**:
- [ ] Schema `orders.ts` creado
- [ ] Schema `order_items.ts` creado
- [ ] Migración generada y aplicada
- [ ] Tablas existen en database.sqlite
- [ ] Ruta `POST /api/orders` implementada
- [ ] Ruta `GET /api/orders/:id` implementada
- [ ] Ruta `GET /api/orders` implementada (lista)
- [ ] Validación de datos con Zod funciona
- [ ] Tests de API pasan

**Frontend**:
- [ ] `checkoutStore.ts` actualizado
- [ ] `orderService.ts` actualizado
- [ ] localStorage.removeItem() llamado
- [ ] Fetch con credentials: 'include'
- [ ] Manejo de errores correcto

**Tests**:
- [ ] Test 1: API crea orden ✅
- [ ] Test 2: localStorage limpio ✅
- [ ] Test 3: Orden visible en DB ✅
- [ ] Test 4: E2E checkout completo ✅
- [ ] No hay regresiones en flujo existente

**Seguridad**:
- [ ] NO se guarda cardNumber/expiryDate
- [ ] NO se guarda PII en localStorage
- [ ] Validación de inputs en backend
- [ ] CORS configurado correctamente
- [ ] Credentials enabled en fetch

---

## 📤 FORMATO DE ENTREGA

```markdown
## TASK-004: COMPLETADA ✅

### Backend - Archivos creados:
- `backend/src/db/schema/orders.ts` (120 líneas)
- `backend/src/routes/orders.ts` (180 líneas)
- `backend/drizzle/[timestamp]_create_orders.sql` (migración)

### Backend - Archivos modificados:
- `backend/src/db/schema/index.ts` (export orders)
- `backend/src/index.ts` (registro de orderRoutes)

### Frontend - Archivos modificados:
- `src/store/checkoutStore.ts` (líneas 140-180 reemplazadas)
- `src/services/orderService.ts` (método placeOrder actualizado)

### Tests ejecutados:
✅ API POST /api/orders crea orden
✅ localStorage.getItem('pureza-naturalis-orders') === null
✅ Orden visible en Drizzle Studio
✅ E2E checkout completo funciona
✅ No hay regresiones

### Métricas de seguridad:
- local_storage_orders: 0 ✅
- PII en cliente: 0 ✅
- Payment details en cliente: 0 ✅

### Próximo paso:
TASK-005: Implementar protección CSRF
```

---

**Última actualización**: 2025-11-07  
**Versión**: 1.0  
**Creado por**: GitHub Copilot (Director de Proyecto)
