# TASK-013: Implementación Completa de APIs de Orders

## 📋 INFORMACIÓN DE LA TAREA

**ID**: TASK-013  
**Fase**: 2 - Backend Robusto  
**Prioridad**: CRÍTICA  
**Estimación**: 5 horas  
**Dependencias**: TASK-004 (Checkout Backend)

## 🎯 OBJETIVO

Implementar endpoints RESTful completos para gestión de pedidos (orders) con CRUD operations, validaciones robustas, paginación, filtros y soporte para admin dashboard.

## 📊 CONTEXTO

**Problema Actual**:
- Hallazgo FUNC-ORDERS-006: APIs `/api/orders` inexistentes
- Frontend no puede consultar historial de pedidos
- Sin endpoints para admin (gestionar pedidos, cambiar estados)
- Sin API para obtener detalles de un pedido específico

**Impacto**:
- Usuarios no pueden ver su historial de compras
- Sin panel de administración funcional
- Imposible rastrear pedidos o cambiar estados (pending → shipped → delivered)

**Solución Propuesta**:
Implementar API completa de orders con:
- GET /api/orders - Listar pedidos (con paginación/filtros)
- GET /api/orders/:id - Detalles de pedido específico
- POST /api/orders - Crear pedido (ya existe en TASK-004)
- PATCH /api/orders/:id - Actualizar estado (solo admin)
- GET /api/orders/stats - Estadísticas para dashboard admin

## 🔍 ANÁLISIS DE REQUISITOS

### Endpoints Necesarios

1. **GET /api/orders** - Listar pedidos
   - Usuario normal: solo sus pedidos
   - Admin: todos los pedidos con filtros avanzados
   - Paginación cursor-based
   - Filtros: status, dateRange, userId

2. **GET /api/orders/:id** - Detalles de pedido
   - Usuario: solo si es su pedido
   - Admin: cualquier pedido
   - Incluir items con info de productos

3. **POST /api/orders** - Crear pedido
   - Ya implementado en TASK-004
   - Mejorar validaciones y respuestas

4. **PATCH /api/orders/:id** - Actualizar estado
   - Solo admin
   - Validar transiciones de estado válidas
   - Logging de cambios

5. **GET /api/orders/stats** - Estadísticas
   - Solo admin
   - Total ventas, pedidos por estado, revenue

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Actualizar Schema de Orders

**Archivo**: `backend/src/db/schema.ts` (revisar/completar)

```typescript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

/**
 * Estados de pedido
 */
export const orderStatusEnum = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof orderStatusEnum[number];

/**
 * Tabla de Pedidos
 */
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  
  // Información de contacto
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  
  // Dirección de envío
  shippingAddress: text('shipping_address').notNull(),
  shippingCity: text('shipping_city').notNull(),
  shippingPostalCode: text('shipping_postal_code').notNull(),
  shippingCountry: text('shipping_country').notNull().default('España'),
  
  // Montos
  subtotal: real('subtotal').notNull(),
  shippingCost: real('shipping_cost').notNull().default(0),
  tax: real('tax').notNull().default(0),
  total: real('total').notNull(),
  
  // Estado y tracking
  status: text('status').notNull().default('pending'), // Ver orderStatusEnum
  trackingNumber: text('tracking_number'),
  
  // Notas
  customerNotes: text('customer_notes'),
  adminNotes: text('admin_notes'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  
  // Soft delete
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

/**
 * Tabla de Items de Pedido
 */
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id),
  
  // Snapshot del producto al momento de compra
  productName: text('product_name').notNull(),
  productSku: text('product_sku'),
  productImage: text('product_image'),
  
  // Precio y cantidad
  price: real('price').notNull(),
  quantity: integer('quantity').notNull(),
  subtotal: real('subtotal').notNull(), // price * quantity
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

/**
 * Relaciones
 */
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
```

### Paso 2: Crear DTOs y Schemas de Validación

**Archivo**: `backend/src/schemas/orders.ts`

```typescript
import { z } from 'zod';

/**
 * Schema de Order Status
 */
export const OrderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]);

/**
 * Schema para crear Order (POST /api/orders)
 */
export const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive().max(100),
  })).min(1, 'Al menos un producto requerido'),
  
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().regex(/^\+?[0-9\s\-()]{9,20}$/, 'Teléfono inválido'),
  
  shippingAddress: z.string().min(5).max(200),
  shippingCity: z.string().min(2).max(100),
  shippingPostalCode: z.string().regex(/^[0-9]{5}$/, 'Código postal español inválido'),
  shippingCountry: z.string().default('España'),
  
  customerNotes: z.string().max(500).optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

/**
 * Schema para actualizar Order (PATCH /api/orders/:id)
 */
export const UpdateOrderSchema = z.object({
  status: OrderStatusSchema.optional(),
  trackingNumber: z.string().max(100).optional(),
  adminNotes: z.string().max(1000).optional(),
});

export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;

/**
 * Schema de Query Params para listado
 */
export const ListOrdersQuerySchema = z.object({
  // Paginación
  limit: z.coerce.number().int().positive().max(100).default(20),
  cursor: z.coerce.number().int().positive().optional(),
  
  // Filtros
  status: OrderStatusSchema.optional(),
  userId: z.coerce.number().int().positive().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  
  // Búsqueda
  search: z.string().max(100).optional(), // Buscar por email, nombre, tracking
});

export type ListOrdersQuery = z.infer<typeof ListOrdersQuerySchema>;

/**
 * DTO de Order Item (respuesta)
 */
export const OrderItemDTO = z.object({
  id: z.number(),
  productId: z.number(),
  productName: z.string(),
  productSku: z.string().nullable(),
  productImage: z.string().nullable(),
  price: z.number(),
  quantity: z.number(),
  subtotal: z.number(),
});

/**
 * DTO de Order (respuesta completa)
 */
export const OrderDTO = z.object({
  id: z.number(),
  userId: z.number(),
  
  customerName: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string(),
  
  shippingAddress: z.string(),
  shippingCity: z.string(),
  shippingPostalCode: z.string(),
  shippingCountry: z.string(),
  
  subtotal: z.number(),
  shippingCost: z.number(),
  tax: z.number(),
  total: z.number(),
  
  status: OrderStatusSchema,
  trackingNumber: z.string().nullable(),
  
  customerNotes: z.string().nullable(),
  adminNotes: z.string().nullable(),
  
  items: z.array(OrderItemDTO),
  
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type OrderDTO = z.infer<typeof OrderDTO>;

/**
 * DTO de Order simplificado (para listados)
 */
export const OrderSummaryDTO = OrderDTO.omit({ items: true, adminNotes: true });
export type OrderSummaryDTO = z.infer<typeof OrderSummaryDTO>;
```

### Paso 3: Implementar OrderService

**Archivo**: `backend/src/services/OrderService.ts`

```typescript
import { Database } from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, and, gte, lte, like, or, desc, sql } from 'drizzle-orm';
import { orders, orderItems, products } from '../db/schema.js';
import { CreateOrderInput, UpdateOrderInput, ListOrdersQuery, OrderDTO, OrderSummaryDTO } from '../schemas/orders.js';
import { logger } from '../config/logger.js';

export class OrderService {
  private db;

  constructor(database: Database) {
    this.db = drizzle(database);
  }

  /**
   * Listar pedidos con paginación y filtros
   */
  async listOrders(query: ListOrdersQuery, userId?: number, isAdmin: boolean = false): Promise<{
    orders: OrderSummaryDTO[];
    nextCursor: number | null;
    hasMore: boolean;
  }> {
    try {
      const conditions = [];

      // Si no es admin, solo ver sus pedidos
      if (!isAdmin && userId) {
        conditions.push(eq(orders.userId, userId));
      }

      // Filtros
      if (query.status) {
        conditions.push(eq(orders.status, query.status));
      }

      if (query.userId && isAdmin) {
        conditions.push(eq(orders.userId, query.userId));
      }

      if (query.dateFrom) {
        conditions.push(gte(orders.createdAt, new Date(query.dateFrom)));
      }

      if (query.dateTo) {
        conditions.push(lte(orders.createdAt, new Date(query.dateTo)));
      }

      if (query.search) {
        conditions.push(
          or(
            like(orders.customerEmail, `%${query.search}%`),
            like(orders.customerName, `%${query.search}%`),
            like(orders.trackingNumber, `%${query.search}%`)
          )
        );
      }

      // Cursor-based pagination
      if (query.cursor) {
        conditions.push(sql`${orders.id} < ${query.cursor}`);
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await this.db
        .select()
        .from(orders)
        .where(whereClause)
        .orderBy(desc(orders.createdAt))
        .limit(query.limit + 1); // +1 para saber si hay más

      const hasMore = results.length > query.limit;
      const ordersData = results.slice(0, query.limit);
      const nextCursor = hasMore ? ordersData[ordersData.length - 1].id : null;

      return {
        orders: ordersData.map(this.mapToSummaryDTO),
        nextCursor,
        hasMore,
      };

    } catch (error) {
      logger.error({ error, query }, 'Failed to list orders');
      throw error;
    }
  }

  /**
   * Obtener detalles de un pedido específico
   */
  async getOrderById(orderId: number, userId?: number, isAdmin: boolean = false): Promise<OrderDTO | null> {
    try {
      const conditions = [eq(orders.id, orderId)];

      // Si no es admin, verificar ownership
      if (!isAdmin && userId) {
        conditions.push(eq(orders.userId, userId));
      }

      const [order] = await this.db
        .select()
        .from(orders)
        .where(and(...conditions))
        .limit(1);

      if (!order) {
        return null;
      }

      // Obtener items del pedido
      const items = await this.db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      return this.mapToDTO(order, items);

    } catch (error) {
      logger.error({ error, orderId }, 'Failed to get order');
      throw error;
    }
  }

  /**
   * Crear nuevo pedido
   */
  async createOrder(input: CreateOrderInput, userId: number): Promise<OrderDTO> {
    try {
      // 1. Obtener productos y calcular precios
      const productIds = input.items.map(item => item.productId);
      const productsData = await this.db
        .select()
        .from(products)
        .where(sql`${products.id} IN (${productIds.join(',')})`);

      if (productsData.length !== productIds.length) {
        throw new Error('Algunos productos no existen');
      }

      // 2. Calcular totales
      let subtotal = 0;
      const orderItemsData = input.items.map(item => {
        const product = productsData.find(p => p.id === item.productId);
        if (!product) throw new Error(`Producto ${item.productId} no encontrado`);

        const itemSubtotal = product.price * item.quantity;
        subtotal += itemSubtotal;

        return {
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          productImage: product.mainImage,
          price: product.price,
          quantity: item.quantity,
          subtotal: itemSubtotal,
        };
      });

      const shippingCost = subtotal >= 50 ? 0 : 4.99; // Envío gratis > 50€
      const tax = subtotal * 0.21; // IVA 21%
      const total = subtotal + shippingCost + tax;

      // 3. Insertar order
      const [newOrder] = await this.db
        .insert(orders)
        .values({
          userId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          shippingPostalCode: input.shippingPostalCode,
          shippingCountry: input.shippingCountry,
          subtotal,
          shippingCost,
          tax,
          total,
          status: 'pending',
          customerNotes: input.customerNotes,
        })
        .returning();

      // 4. Insertar order items
      const insertedItems = await this.db
        .insert(orderItems)
        .values(
          orderItemsData.map(item => ({
            ...item,
            orderId: newOrder.id,
          }))
        )
        .returning();

      logger.info({ orderId: newOrder.id, userId, total }, 'Order created successfully');

      return this.mapToDTO(newOrder, insertedItems);

    } catch (error) {
      logger.error({ error, input }, 'Failed to create order');
      throw error;
    }
  }

  /**
   * Actualizar estado de pedido (solo admin)
   */
  async updateOrder(orderId: number, input: UpdateOrderInput): Promise<OrderDTO | null> {
    try {
      // Validar transición de estado
      if (input.status) {
        const [currentOrder] = await this.db
          .select({ status: orders.status })
          .from(orders)
          .where(eq(orders.id, orderId))
          .limit(1);

        if (!currentOrder) {
          return null;
        }

        if (!this.isValidStatusTransition(currentOrder.status, input.status)) {
          throw new Error(`Invalid status transition: ${currentOrder.status} -> ${input.status}`);
        }
      }

      // Actualizar
      const [updated] = await this.db
        .update(orders)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))
        .returning();

      if (!updated) {
        return null;
      }

      logger.info({ orderId, updates: input }, 'Order updated');

      // Obtener items y retornar DTO completo
      const items = await this.db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      return this.mapToDTO(updated, items);

    } catch (error) {
      logger.error({ error, orderId, input }, 'Failed to update order');
      throw error;
    }
  }

  /**
   * Validar transiciones de estado válidas
   */
  private isValidStatusTransition(from: string, to: string): boolean {
    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [], // Estado final
      cancelled: [], // Estado final
    };

    return validTransitions[from]?.includes(to) ?? false;
  }

  /**
   * Obtener estadísticas de pedidos (solo admin)
   */
  async getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: Record<string, number>;
    recentOrders: number;
  }> {
    try {
      const [stats] = await this.db
        .select({
          totalOrders: sql<number>`COUNT(*)`,
          totalRevenue: sql<number>`SUM(${orders.total})`,
        })
        .from(orders)
        .where(sql`${orders.status} != 'cancelled'`);

      const ordersByStatusData = await this.db
        .select({
          status: orders.status,
          count: sql<number>`COUNT(*)`,
        })
        .from(orders)
        .groupBy(orders.status);

      const ordersByStatus: Record<string, number> = {};
      ordersByStatusData.forEach(row => {
        ordersByStatus[row.status] = row.count;
      });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [recentStats] = await this.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(orders)
        .where(gte(orders.createdAt, thirtyDaysAgo));

      return {
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue || 0,
        ordersByStatus,
        recentOrders: recentStats.count,
      };

    } catch (error) {
      logger.error({ error }, 'Failed to get order stats');
      throw error;
    }
  }

  /**
   * Mapear Order a DTO completo
   */
  private mapToDTO(order: any, items: any[]): OrderDTO {
    return {
      id: order.id,
      userId: order.userId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingPostalCode: order.shippingPostalCode,
      shippingCountry: order.shippingCountry,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      total: order.total,
      status: order.status,
      trackingNumber: order.trackingNumber,
      customerNotes: order.customerNotes,
      adminNotes: order.adminNotes,
      items: items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  /**
   * Mapear Order a DTO simplificado
   */
  private mapToSummaryDTO(order: any): OrderSummaryDTO {
    return {
      id: order.id,
      userId: order.userId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingPostalCode: order.shippingPostalCode,
      shippingCountry: order.shippingCountry,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      total: order.total,
      status: order.status,
      trackingNumber: order.trackingNumber,
      customerNotes: order.customerNotes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}
```

---

### Paso 4: Implementar Rutas de Orders

**Archivo**: `backend/src/routes/orders.ts`

```typescript
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { OrderService } from '../services/OrderService.js';
import {
  CreateOrderSchema,
  UpdateOrderSchema,
  ListOrdersQuerySchema,
  OrderDTO,
  OrderSummaryDTO,
} from '../schemas/orders.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

export default async function ordersRoutes(app: FastifyInstance, opts: FastifyPluginOptions) {
  const orderService = new OrderService(app.db); // Asumiendo app.db disponible

  /**
   * GET /api/orders
   * Listar pedidos del usuario (o todos si es admin)
   */
  app.get<{
    Querystring: typeof ListOrdersQuerySchema._type;
    Reply: {
      orders: OrderSummaryDTO[];
      nextCursor: number | null;
      hasMore: boolean;
    };
  }>('/api/orders', {
    preValidation: [authenticate],
    schema: {
      querystring: ListOrdersQuerySchema,
      response: {
        200: {
          type: 'object',
          properties: {
            orders: { type: 'array' },
            nextCursor: { type: ['number', 'null'] },
            hasMore: { type: 'boolean' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const query = request.query;
    const user = (request as any).user; // Del middleware authenticate

    const result = await orderService.listOrders(
      query,
      user.id,
      user.role === 'admin'
    );

    return result;
  });

  /**
   * GET /api/orders/:id
   * Obtener detalles de un pedido específico
   */
  app.get<{
    Params: { id: string };
    Reply: OrderDTO | { error: string };
  }>('/api/orders/:id', {
    preValidation: [authenticate],
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', pattern: '^[0-9]+$' },
        },
        required: ['id'],
      },
      response: {
        200: { $ref: 'OrderDTO#' },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const orderId = parseInt(request.params.id);
    const user = (request as any).user;

    const order = await orderService.getOrderById(
      orderId,
      user.id,
      user.role === 'admin'
    );

    if (!order) {
      return reply.code(404).send({ error: 'Order not found or access denied' });
    }

    return order;
  });

  /**
   * POST /api/orders
   * Crear nuevo pedido
   */
  app.post<{
    Body: typeof CreateOrderSchema._type;
    Reply: OrderDTO;
  }>('/api/orders', {
    preValidation: [authenticate],
    schema: {
      body: CreateOrderSchema,
      response: {
        201: { $ref: 'OrderDTO#' },
      },
    },
  }, async (request, reply) => {
    const user = (request as any).user;

    const order = await orderService.createOrder(request.body, user.id);

    return reply.code(201).send(order);
  });

  /**
   * PATCH /api/orders/:id
   * Actualizar estado de pedido (solo admin)
   */
  app.patch<{
    Params: { id: string };
    Body: typeof UpdateOrderSchema._type;
    Reply: OrderDTO | { error: string };
  }>('/api/orders/:id', {
    preValidation: [authenticate, authorizeAdmin],
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', pattern: '^[0-9]+$' },
        },
        required: ['id'],
      },
      body: UpdateOrderSchema,
      response: {
        200: { $ref: 'OrderDTO#' },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const orderId = parseInt(request.params.id);

    const order = await orderService.updateOrder(orderId, request.body);

    if (!order) {
      return reply.code(404).send({ error: 'Order not found' });
    }

    return order;
  });

  /**
   * GET /api/orders/stats
   * Obtener estadísticas de pedidos (solo admin)
   */
  app.get('/api/orders/stats', {
    preValidation: [authenticate, authorizeAdmin],
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            totalOrders: { type: 'number' },
            totalRevenue: { type: 'number' },
            ordersByStatus: { type: 'object' },
            recentOrders: { type: 'number' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const stats = await orderService.getOrderStats();
    return stats;
  });
}
```

### Paso 5: Middleware de Autorización

**Archivo**: `backend/src/middleware/auth.ts`

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware de autenticación
 * Verifica JWT y adjunta user a request
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role: string;
    };

    // Adjuntar user a request
    (request as any).user = {
      id: decoded.userId,
      role: decoded.role,
    };

  } catch (error) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware de autorización de admin
 * Requiere que authenticate se haya ejecutado antes
 */
export async function authorizeAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;

  if (!user || user.role !== 'admin') {
    return reply.code(403).send({ error: 'Admin access required' });
  }
}
```

### Paso 6: Tests de Integración

**Archivo**: `backend/src/tests/routes/orders.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../../app.js';
import jwt from 'jsonwebtoken';

describe('Orders API', () => {
  let app: FastifyInstance;
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    app = await buildApp({ logger: false });
    await app.ready();

    // Generar tokens de prueba
    userToken = jwt.sign({ userId: 1, role: 'user' }, process.env.JWT_SECRET || 'test-secret');
    adminToken = jwt.sign({ userId: 2, role: 'admin' }, process.env.JWT_SECRET || 'test-secret');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/orders', () => {
    it('should create order successfully', async () => {
      const orderData = {
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
        customerName: 'Juan Pérez',
        customerEmail: 'juan@example.com',
        customerPhone: '+34 600123456',
        shippingAddress: 'Calle Mayor 123',
        shippingCity: 'Madrid',
        shippingPostalCode: '28001',
        shippingCountry: 'España',
        customerNotes: 'Entregar por la mañana',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/orders',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        payload: orderData,
      });

      expect(response.statusCode).toBe(201);
      const order = JSON.parse(response.body);
      expect(order.id).toBeDefined();
      expect(order.status).toBe('pending');
      expect(order.items).toHaveLength(2);
      expect(order.total).toBeGreaterThan(0);
    });

    it('should reject order without authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/orders',
        payload: {},
      });

      expect(response.statusCode).toBe(401);
    });

    it('should validate order data', async () => {
      const invalidOrder = {
        items: [], // Vacío - inválido
        customerName: 'A', // Muy corto
        customerEmail: 'invalid-email',
        customerPhone: '123',
        shippingAddress: 'A',
        shippingCity: 'M',
        shippingPostalCode: '123', // Formato inválido
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/orders',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        payload: invalidOrder,
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/orders', () => {
    it('should list user orders', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data.orders).toBeInstanceOf(Array);
      expect(data.hasMore).toBeDefined();
      expect(data.nextCursor).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders?limit=10&cursor=5',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
    });

    it('should support filtering by status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders?status=pending',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body);
      expect(data.orders.every((o: any) => o.status === 'pending')).toBe(true);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should get order details', async () => {
      // Primero crear un pedido
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/orders',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        payload: {
          items: [{ productId: 1, quantity: 1 }],
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '+34 600000000',
          shippingAddress: 'Test Address',
          shippingCity: 'Madrid',
          shippingPostalCode: '28001',
        },
      });

      const order = JSON.parse(createResponse.body);

      // Obtener detalles
      const response = await app.inject({
        method: 'GET',
        url: `/api/orders/${order.id}`,
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const details = JSON.parse(response.body);
      expect(details.id).toBe(order.id);
      expect(details.items).toBeDefined();
    });

    it('should deny access to other user orders', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders/999', // Order de otro usuario
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/orders/:id', () => {
    it('should allow admin to update order status', async () => {
      // Crear pedido
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/orders',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        payload: {
          items: [{ productId: 1, quantity: 1 }],
          customerName: 'Test',
          customerEmail: 'test@example.com',
          customerPhone: '+34 600000000',
          shippingAddress: 'Address',
          shippingCity: 'Madrid',
          shippingPostalCode: '28001',
        },
      });

      const order = JSON.parse(createResponse.body);

      // Actualizar como admin
      const response = await app.inject({
        method: 'PATCH',
        url: `/api/orders/${order.id}`,
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          status: 'confirmed',
          trackingNumber: 'TRACK123456',
        },
      });

      expect(response.statusCode).toBe(200);
      const updated = JSON.parse(response.body);
      expect(updated.status).toBe('confirmed');
      expect(updated.trackingNumber).toBe('TRACK123456');
    });

    it('should deny non-admin users', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/api/orders/1',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        payload: {
          status: 'confirmed',
        },
      });

      expect(response.statusCode).toBe(403);
    });

    it('should validate status transitions', async () => {
      // Intentar transición inválida: delivered -> pending
      const response = await app.inject({
        method: 'PATCH',
        url: '/api/orders/1',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          status: 'pending', // Inválido si ya está delivered
        },
      });

      // Debería fallar con error de validación
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /api/orders/stats', () => {
    it('should return stats for admin', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders/stats',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const stats = JSON.parse(response.body);
      expect(stats.totalOrders).toBeDefined();
      expect(stats.totalRevenue).toBeDefined();
      expect(stats.ordersByStatus).toBeDefined();
      expect(stats.recentOrders).toBeDefined();
    });

    it('should deny non-admin users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders/stats',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      expect(response.statusCode).toBe(403);
    });
  });
});
```

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Funcionales

- [x] GET /api/orders retorna pedidos del usuario
- [x] GET /api/orders soporta paginación cursor-based
- [x] GET /api/orders soporta filtros (status, dateRange, search)
- [x] GET /api/orders/:id retorna detalles con items
- [x] POST /api/orders crea pedido con cálculo correcto
- [x] PATCH /api/orders/:id actualiza estado (solo admin)
- [x] GET /api/orders/stats retorna métricas (solo admin)
- [x] Validación de transiciones de estado

### Técnicos

- [x] Schemas Zod para validación
- [x] DTOs bien definidos
- [x] OrderService con separación de responsabilidades
- [x] Tests de integración completos
- [x] Middleware de autenticación y autorización
- [x] Logging estructurado

### Seguridad

- [x] Usuarios solo ven sus pedidos
- [x] Admin puede ver/modificar todos
- [x] Validación de inputs
- [x] Transiciones de estado controladas

## 🧪 VALIDACIÓN

```bash
# Tests
npm test orders.test.ts

# Crear pedido
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": 1, "quantity": 2}],
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "customerPhone": "+34 600123456",
    "shippingAddress": "Calle Test 123",
    "shippingCity": "Madrid",
    "shippingPostalCode": "28001"
  }'

# Listar pedidos
curl http://localhost:3000/api/orders \
  -H "Authorization: Bearer $TOKEN"

# Obtener detalles
curl http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer $TOKEN"

# Actualizar estado (admin)
curl -X PATCH http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed", "trackingNumber": "TRACK123"}'

# Stats (admin)
curl http://localhost:3000/api/orders/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

**Última Actualización**: 2025-11-07  
**Status**: COMPLETO ✅

