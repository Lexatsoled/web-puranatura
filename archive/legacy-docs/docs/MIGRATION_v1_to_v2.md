# Guía de Migración v1 → v2

Esta guía proporciona instrucciones paso a paso para migrar de la API v1 a v2 de Puranatura.

## ¿Por qué migrar?

**v1** será **sunset el 2026-06-01**. Debes migrar a **v2** antes de esa fecha.

### Ventajas de v2

- ✅ Información de variantes de productos (tamaños, presentaciones, etc.)
- ✅ Reseñas de productos integradas
- ✅ Información completa de seguimiento de pedidos
- ✅ Mejor estructura de datos
- ✅ Soporte a largo plazo

## Cronograma de Deprecación

| Fase  | Periodo                 | Estado              | Acción Requerida    |
| ----- | ----------------------- | ------------------- | ------------------- |
| **1** | Ahora - 2025-06-01      | v1 Active + Headers | Planifica migración |
| **2** | 2025-06-01 - 2026-06-01 | v1 + v2 Active      | **Migra a v2**      |
| **3** | Después 2026-06-01      | Solo v2             | v1 NO disponible    |

## Cambios Principales

### 1. URL Base

```javascript
// ❌ v1 (Deprecated)
const baseURL = 'https://api.purezanaturalis.com/api/products';

// ✅ v2 (Nuevo)
const baseURL = 'https://api.purezanaturalis.com/api/v2/products';
```

### 2. Productos: Nuevas Propiedades

#### v1 Response (Antiguo)

```json
{
  "products": [
    {
      "id": 1,
      "name": "Ashwagandha Premium",
      "description": "...",
      "price": 29.99,
      "stock": 50,
      "category": "vitaminas",
      "images": ["..."],
      "rating": 4.5,
      "reviewCount": 12
    }
  ]
}
```

#### v2 Response (Nuevo)

```json
{
  "products": [
    {
      "id": 1,
      "name": "Ashwagandha Premium",
      "description": "...",
      "price": 29.99,
      "stock": 50,
      "category": "vitaminas",
      "images": ["..."],
      "rating": 4.5,
      "reviewCount": 12,
      "variants": [
        {
          "id": "variant-1-base",
          "name": "Presentación Estándar",
          "price": 29.99,
          "available": true,
          "sku": "ASH-PREM-001",
          "attributes": {
            "size": "Estándar",
            "categoría": "bienestar"
          }
        },
        {
          "id": "variant-1-premium",
          "name": "Presentación Premium",
          "price": 39.99,
          "available": true,
          "sku": "ASH-PREM-PREMIUM",
          "attributes": {
            "size": "Premium",
            "tier": "premium",
            "categoría": "bienestar"
          }
        }
      ],
      "reviews": [
        {
          "id": "review-1-1",
          "rating": 5,
          "title": "Excelente producto",
          "body": "Me ha funcionado muy bien después de 2 semanas...",
          "author": "Juan Pérez",
          "createdAt": "2025-11-07T20:00:00.000Z",
          "helpfulVotes": 5
        }
      ],
      "avgRating": 4.5,
      "reviewsCount": 12
    }
  ]
}
```

### 3. Pedidos: Información de Seguimiento

#### v1 Response (Antiguo)

```json
{
  "order": {
    "id": "ORD-1234567890-abc123",
    "userId": "user-123",
    "status": "shipped",
    "trackingNumber": "TRK-9876543210",
    "items": [
      {
        "productId": "123",
        "productName": "Ashwagandha Premium",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "total": 59.98,
    "createdAt": "2025-11-08T10:30:00.000Z"
  }
}
```

#### v2 Response (Nuevo)

```json
{
  "order": {
    "id": "ORD-1234567890-abc123",
    "userId": "user-123",
    "status": "shipped",
    "lineItems": [
      {
        "productId": "123",
        "productName": "Ashwagandha Premium",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "total": 59.98,
    "createdAt": "2025-11-08T10:30:00.000Z",
    "tracking": {
      "carrier": "Pureza Express",
      "trackingNumber": "TRK-9876543210",
      "status": "shipped",
      "estimatedDelivery": "2025-11-13T10:30:00.000Z",
      "url": "https://tracking.purezanaturalis.com/TRK-9876543210"
    }
  }
}
```

## Guía Paso a Paso

### Paso 1: Actualizar Configuración

```typescript
// config/api.ts

// ❌ Antes
export const API_BASE_URL = 'https://api.purezanaturalis.com/api';

// ✅ Después
export const API_BASE_URL = 'https://api.purezanaturalis.com/api/v2';
```

### Paso 2: Actualizar Cliente API

```typescript
// services/apiClient.ts

import axios from 'axios';

// ❌ Antigua configuración
// const client = axios.create({
//   baseURL: 'https://api.purezanaturalis.com/api'
// });

// ✅ Nueva configuración
const client = axios.create({
  baseURL: 'https://api.purezanaturalis.com/api/v2',
  headers: {
    'Accept-Version': 'v2', // Opcional, pero recomendado
  },
});

export default client;
```

### Paso 3: Actualizar Componentes - Productos

```typescript
// components/ProductCard.tsx

// ❌ v1 - Antes
export function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>Precio: ${product.price}</p>
      <p>Calificación: {product.rating} ⭐</p>
      <p>Reseñas: {product.reviewCount}</p>
    </div>
  );
}

// ✅ v2 - Después
export function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>Precio: ${product.price}</p>
      <p>Calificación: {product.avgRating} ⭐</p>
      <p>Reseñas: {product.reviewsCount}</p>

      {/* Nuevas características */}
      {product.variants && product.variants.length > 0 && (
        <div className="variants">
          <label>Selecciona presentación:</label>
          <select onChange={(e) => handleVariantSelect(e.target.value)}>
            <option value="">- Elige una opción -</option>
            {product.variants.map(variant => (
              <option key={variant.id} value={variant.id}>
                {variant.name} - ${variant.price}
              </option>
            ))}
          </select>
        </div>
      )}

      {product.reviews && product.reviews.length > 0 && (
        <div className="reviews">
          <h4>Reseñas</h4>
          {product.reviews.map(review => (
            <div key={review.id} className="review">
              <p><strong>{review.author}</strong> - ⭐ {review.rating}</p>
              <p><strong>{review.title}</strong></p>
              <p>{review.body}</p>
              <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Paso 4: Actualizar Componentes - Pedidos

```typescript
// components/OrderCard.tsx

// ❌ v1 - Antes
export function OrderCard({ order }) {
  return (
    <div>
      <h3>Pedido {order.id}</h3>
      <p>Estado: {order.status}</p>
      {order.trackingNumber && (
        <p>Tracking: {order.trackingNumber}</p>
      )}
      <ul>
        {order.items.map(item => (
          <li key={item.productId}>
            {item.productName} x{item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ✅ v2 - Después
export function OrderCard({ order }) {
  return (
    <div>
      <h3>Pedido {order.id}</h3>
      <p>Estado: {order.status}</p>

      {/* Nueva información de seguimiento */}
      {order.tracking && (
        <div className="tracking-info">
          <h4>Información de Seguimiento</h4>
          <p><strong>Transportista:</strong> {order.tracking.carrier}</p>
          <p><strong>Número:</strong> {order.tracking.trackingNumber}</p>
          <p><strong>Estado:</strong> {order.tracking.status}</p>
          <p><strong>Entrega estimada:</strong></p>
          <p>{new Date(order.tracking.estimatedDelivery).toLocaleDateString()}</p>
          {order.tracking.url && (
            <a href={order.tracking.url} target="_blank" rel="noopener noreferrer">
              Ver en transportista →
            </a>
          )}
        </div>
      )}

      <ul>
        {order.lineItems.map(item => (
          <li key={item.productId}>
            {item.productName} x{item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Paso 5: Actualizar Llamadas API

```typescript
// services/productService.ts

// ❌ v1 - Antes
export async function getProducts(filters) {
  const response = await client.get('/products', { params: filters });
  return response.data;
}

// ✅ v2 - Después
export async function getProducts(filters) {
  // Ya usa baseURL v2 (https://api.purezanaturalis.com/api/v2)
  const response = await client.get('/products', { params: filters });

  // Procesar nuevos campos
  return response.data.map((product) => ({
    ...product,
    displayRating: product.avgRating || 0,
    displayReviewCount: product.reviewsCount || 0,
    hasVariants: product.variants && product.variants.length > 0,
    reviews: product.reviews || [],
  }));
}

export async function getProductById(id) {
  const response = await client.get(`/products/${id}`);
  return response.data;
}

// ❌ v1 - Antes
export async function getOrders() {
  const response = await client.get('/orders');
  return response.data;
}

// ✅ v2 - Después
export async function getOrders() {
  // Ya usa baseURL v2
  const response = await client.get('/orders');

  // Procesar nueva estructura
  return response.data.map((order) => ({
    ...order,
    items: order.lineItems, // Para compatibilidad
    tracking: order.tracking || {
      carrier: 'N/A',
      trackingNumber: null,
      status: 'unknown',
      estimatedDelivery: null,
      url: null,
    },
  }));
}
```

### Paso 6: Manejar Headers de Deprecación

```typescript
// hooks/useDeprecationWarning.ts

import { useEffect } from 'react';
import client from '../services/apiClient';

export function useDeprecationWarning() {
  useEffect(() => {
    // Interceptar respuestas y verificar headers de deprecación
    client.interceptors.response.use(
      response => {
        const deprecation = response.headers['deprecation'];
        const sunset = response.headers['sunset'];

        if (deprecation || sunset) {
          console.warn('⚠️ API Deprecation Notice');
          console.warn('Deprecation:', deprecation);
          console.warn('Sunset:', sunset);
          console.warn('Migration Guide: https://github.com/.../MIGRATION_v1_to_v2.md');

          // Enviar métrica (opcional)
          trackDeprecationUsage({
            endpoint: response.config.url,
            timestamp: new Date()
          });
        }

        return response;
      }
    );
  }, []);
}

// Usar en App.tsx
import { useDeprecationWarning } from './hooks/useDeprecationWarning';

export function App() {
  useDeprecationWarning();

  return (
    // ...
  );
}
```

## Verificación de Migración

### Checklist

- [ ] Actualicé la URL base en configuración
- [ ] Actualicé el cliente HTTP a v2
- [ ] Actualicé componentes para usar `variants`
- [ ] Actualicé componentes para usar `reviews`
- [ ] Actualicé componentes para usar `tracking`
- [ ] Renombré `items` a `lineItems` en pedidos
- [ ] Actualicé llamadas a API
- [ ] Probé en desarrollo
- [ ] Probé en staging
- [ ] Desplegué a producción

### Testing

```bash
# Verificar que v2 responde
curl -i https://api.purezanaturalis.com/api/v2/products

# Verificar que v1 aún funciona (con headers)
curl -i https://api.purezanaturalis.com/api/products | grep -i "deprecation\|sunset"

# Verificar campos nuevos
curl https://api.purezanaturalis.com/api/v2/products \
  | jq '.products[0] | keys'
```

Deberías ver: `variants`, `reviews`, `avgRating`, `reviewsCount`

## Preguntas Frecuentes

### ¿Qué pasa si no migro antes de 2026-06-01?

Tu aplicación dejará de funcionar. No habrá v1 disponible después de esa fecha.

### ¿Puedo usar v1 después de 2026-06-01?

No. Solo v2 estará disponible a partir de esa fecha.

### ¿Los datos se pierden en la migración?

No. Los datos se conservan. Solo cambia la estructura de la respuesta.

### ¿Tengo que usar todos los campos nuevos?

No. Los campos nuevos son opcionales. Puedes ignorarlos si tu aplicación no los necesita.

### ¿Cómo reporte un problema con v2?

Abre un issue en: https://github.com/pureza-naturalis/pureza-naturalis-v3/issues

## Soporte

- **Email**: backend@purezanaturalis.com
- **Slack**: #backend-support
- **Documentación**: [API_VERSIONING.md](./API_VERSIONING.md)
- **GitHub**: [Issues](https://github.com/pureza-naturalis/pureza-naturalis-v3/issues)
