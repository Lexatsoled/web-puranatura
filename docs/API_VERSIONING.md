# API Versioning - Pureza Naturalis Backend

## Estrategia de Versionado

Pureza Naturalis Backend implementa **URL-based versioning** para gestionar cambios en la API de forma transparente y permitir migraciones graduales sin romper integraciones existentes.

## Versiones Disponibles

### **v1** (Current - Deprecated)
- **Ruta base**: `/api/v1/*` y `/api/*` (fallback)
- **Estado**: Deprecated
- **Sunset Date**: 2026-06-01
- **Backward Compatibility**: ✅ Total con rutas `/api/*` sin versión

### **v2** (Latest)
- **Ruta base**: `/api/v2/*`
- **Estado**: Active
- **Breaking Changes**: Sí (ver sección de Breaking Changes)

## Endpoints por Versión

### Endpoints v1 (Deprecated)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/products` | Lista productos (estructura base) |
| `GET` | `/api/products/:id` | Detalle de producto |
| `GET` | `/api/products/featured` | Productos destacados |
| `GET` | `/api/products/search?q=` | Búsqueda de productos |
| `GET` | `/api/products/category/:category` | Productos por categoría |
| `GET` | `/api/products/system/:systemId` | Productos por sistema corporal |
| `POST` | `/api/orders` | Crear pedido |
| `GET` | `/api/orders` | Listar pedidos (auth requerido) |
| `GET` | `/api/orders/:orderId` | Detalle de pedido |
| `PATCH` | `/api/orders/:orderId` | Actualizar estado (admin only) |
| `GET` | `/api/orders/stats` | Estadísticas (admin only) |
| `POST` | `/api/auth/register` | Registro de usuario |
| `POST` | `/api/auth/login` | Login de usuario |
| `POST` | `/api/auth/refresh` | Refrescar token |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/search?q=` | Búsqueda global |
| `GET` | `/api/admin/users` | Gestión usuarios (admin) |
| `DELETE` | `/api/admin/users/:id` | Eliminar usuario (admin) |
| `POST` | `/api/sessions` | Crear sesión anónima |
| `GET` | `/api/sessions/:id` | Obtener sesión |

### Endpoints v2 (Latest)

| Método | Ruta | Descripción | Cambios vs v1 |
|--------|------|-------------|---------------|
| `GET` | `/api/v2/products` | Lista productos | ✅ Incluye `variants[]` y `reviews[]` |
| `GET` | `/api/v2/products/:id` | Detalle de producto | ✅ Incluye `variants[]` y `reviews[]` |
| `GET` | `/api/v2/products/featured` | Productos destacados | ✅ Incluye `variants[]` y `reviews[]` |
| `GET` | `/api/v2/products/search?q=` | Búsqueda | ✅ Incluye `variants[]` y `reviews[]` |
| `GET` | `/api/v2/products/category/:category` | Por categoría | ✅ Incluye `variants[]` y `reviews[]` |
| `GET` | `/api/v2/products/system/:systemId` | Por sistema | ✅ Incluye `variants[]` y `reviews[]` |
| `POST` | `/api/v2/orders` | Crear pedido | ✅ Incluye `tracking` info |
| `GET` | `/api/v2/orders` | Listar pedidos | ✅ Incluye `tracking` info |
| `GET` | `/api/v2/orders/:orderId` | Detalle de pedido | ✅ Incluye `tracking` info |
| `PATCH` | `/api/v2/orders/:orderId` | Actualizar estado | Sin cambios |
| `GET` | `/api/v2/orders/stats` | Estadísticas | Sin cambios |

**Nota**: Los endpoints de `auth`, `search`, `admin` y `sessions` no tienen cambios entre v1 y v2, por lo que solo están disponibles en rutas v1.

## Headers de Deprecación (v1)

Todas las respuestas de endpoints v1 (tanto `/api/*` como `/api/v1/*`) incluyen estos headers:

```http
Deprecation: La API v1 está en camino de ser retirada; migra a /api/v2
Sunset: Sat, 01 Jun 2026 00:00:00 GMT
Link: <https://github.com/pureza-naturalis/pureza-naturalis-v3/blob/main/docs/MIGRATION_v1_to_v2.md>; rel="deprecation"; title="Guía de migración v1"
```

### Significado de Headers

- **`Deprecation`**: Mensaje de advertencia sobre la deprecación
- **`Sunset`**: Fecha después de la cual v1 dejará de funcionar
- **`Link`**: URL con rel="deprecation" apuntando a la guía de migración

## Negociación de Versión

La versión se determina en este orden de prioridad:

1. **URL Path** (más prioritario)
   ```
   GET /api/v2/products  → v2
   GET /api/v1/products  → v1
   GET /api/products     → v1 (fallback)
   ```

2. **Header `Accept-Version`**
   ```http
   GET /api/products
   Accept-Version: v2
   ```
   Solo se aplica si la URL no especifica versión explícitamente.

3. **Default Fallback**
   ```
   GET /api/products → v1 (API_VERSION_DEFAULT)
   ```

## Breaking Changes en v2

### 1. Productos (`/api/v2/products`)

#### Campos Nuevos

**`variants[]`** - Array de variantes del producto
```typescript
{
  id: string;              // e.g., "variant-123-base"
  name: string;            // e.g., "Producto Clásico"
  price: number;           // Precio de esta variante
  available: boolean;      // Disponibilidad (stock > 0)
  sku: string | null;      // SKU de la variante
  attributes: {            // Atributos personalizados
    size?: string;         // e.g., "Estándar", "Premium"
    tier?: string;         // e.g., "premium"
    categoría: string;     // Categoría del producto
    featured?: string;     // "sí" | "no"
  };
}
```

**`reviews[]`** - Array de reseñas del producto
```typescript
{
  id: string;              // e.g., "review-123-1"
  rating: number;          // 1-5
  title: string;           // Título de la reseña
  body: string;            // Comentario completo
  author: string;          // Nombre del autor
  createdAt: string;       // ISO 8601 timestamp
  helpfulVotes: number;    // Cantidad de votos útiles
}
```

#### Ejemplo Comparativo

**v1 Response**:
```json
{
  "products": [
    {
      "id": 123,
      "name": "Ashwagandha Premium",
      "price": 29.99,
      "rating": 4.5,
      "reviewCount": 12,
      "stock": 50
    }
  ]
}
```

**v2 Response**:
```json
{
  "products": [
    {
      "id": 123,
      "name": "Ashwagandha Premium",
      "price": 29.99,
      "rating": 4.5,
      "reviewCount": 12,
      "stock": 50,
      "variants": [
        {
          "id": "variant-123-base",
          "name": "Ashwagandha Premium Clásico",
          "price": 29.99,
          "available": true,
          "sku": "ASH-PREM-001",
          "attributes": {
            "size": "Estándar",
            "categoría": "bienestar"
          }
        },
        {
          "id": "variant-123-premium",
          "name": "Ashwagandha Premium Premium",
          "price": 34.49,
          "available": true,
          "sku": "ASH-PREM-001-PREM",
          "attributes": {
            "size": "Premium",
            "tier": "premium",
            "categoría": "bienestar"
          }
        }
      ],
      "reviews": [
        {
          "id": "review-123-1",
          "rating": 5,
          "title": "Reseña #1 de Ashwagandha Premium",
          "body": "Comentario generado automáticamente para Ashwagandha Premium",
          "author": "Cliente 1",
          "createdAt": "2025-11-07T20:00:00.000Z",
          "helpfulVotes": 0
        }
      ]
    }
  ]
}
```

### 2. Pedidos (`/api/v2/orders`)

#### Campos Nuevos

**`tracking`** - Información de seguimiento del pedido
```typescript
{
  number: string | null;           // Número de tracking (trackingNumber)
  carrier: string;                 // "Pureza Express"
  status: OrderStatus;             // Estado actual del pedido
  estimatedDelivery: string;       // ISO timestamp (createdAt + 5 días)
  url: string | null;              // URL de tracking completa
}
```

**`lineItems`** - Renombrado de `items`
- v1 usa `items[]`
- v2 usa `lineItems[]` (mismo contenido, nombre más descriptivo)

#### Ejemplo Comparativo

**v1 Response**:
```json
{
  "order": {
    "id": "ORD-1234567890-abc123",
    "status": "shipped",
    "trackingNumber": "TRK-9876543210",
    "items": [
      {
        "productId": "123",
        "productName": "Ashwagandha Premium",
        "quantity": 2,
        "price": 29.99
      }
    ]
  }
}
```

**v2 Response**:
```json
{
  "order": {
    "id": "ORD-1234567890-abc123",
    "status": "shipped",
    "trackingNumber": "TRK-9876543210",
    "lineItems": [
      {
        "productId": "123",
        "productName": "Ashwagandha Premium",
        "quantity": 2,
        "price": 29.99
      }
    ],
    "tracking": {
      "number": "TRK-9876543210",
      "carrier": "Pureza Express",
      "status": "shipped",
      "estimatedDelivery": "2025-11-13T10:30:00.000Z",
      "url": "https://tracking.purezanaturalis.com/TRK-9876543210"
    }
  }
}
```

## Configuración

Las siguientes variables de entorno controlan el comportamiento del versionado:

```bash
# Versión por defecto cuando no se especifica en URL o header
API_VERSION_DEFAULT=v1

# Fecha de sunset para v1 (formato ISO 8601 o cualquier formato válido)
API_V1_SUNSET_DATE=2026-06-01
```

## Implementación Técnica

### Middleware de Versionamiento

El middleware `versionMiddleware` se ejecuta en cada request y agrega al objeto `request` la propiedad `versionContext`:

```typescript
request.versionContext = {
  negotiated: 'v1' | 'v2',      // Versión negociada final
  requested: 'v1' | 'v2' | undefined,  // Versión del header Accept-Version
  pathVersion: 'v1' | 'v2' | undefined // Versión de la URL
}
```

### Plugin de Versionamiento

El plugin `versioningPlugin` registra todas las rutas con sus prefijos correspondientes:

```typescript
// v1: Doble registro para backward compatibility
await app.register(productRoutesV1, { prefix: '/api/products' });
await app.register(productRoutesV1, { prefix: '/api/v1/products' });

// v2: Registro único
await app.register(productRoutesV2, { prefix: '/api/v2/products' });
```

### Hook de Deprecación

Un hook `onSend` inyecta los headers de deprecación automáticamente:

```typescript
app.addHook('onSend', async (request, reply) => {
  const currentVersion = request.versionContext?.negotiated ?? 'v1';
  if (currentVersion === 'v1') {
    const headers = deprecationWarning({
      version: 'v1',
      sunsetDate: '2026-06-01',
      message: 'La API v1 está en camino de ser retirada; migra a /api/v2',
      migrationUrl: 'https://github.com/.../MIGRATION_v1_to_v2.md'
    });
    // Inyectar headers...
  }
});
```

## Testing

### Verificar Versión Negociada

```bash
# v1 explícito
curl -i https://api.purezanaturalis.com/api/v1/products

# v1 fallback
curl -i https://api.purezanaturalis.com/api/products

# v1 por header
curl -i -H "Accept-Version: v1" https://api.purezanaturalis.com/api/products

# v2
curl -i https://api.purezanaturalis.com/api/v2/products
```

### Verificar Headers de Deprecación

```bash
curl -i https://api.purezanaturalis.com/api/products | grep -i "deprecation\|sunset\|link"
```

Deberías ver:
```
Deprecation: La API v1 está en camino de ser retirada; migra a /api/v2
Sunset: Sat, 01 Jun 2026 00:00:00 GMT
Link: <https://github.com/.../MIGRATION_v1_to_v2.md>; rel="deprecation"; title="Guía de migración v1"
```

## Roadmap

- **Ahora - Mayo 2026**: v1 y v2 coexisten, v1 con headers de deprecación
- **Junio 2026**: v1 deja de funcionar, solo v2 disponible
- **Futuro**: v3 se introducirá con el mismo proceso de deprecación gradual

## Referencias

- [Guía de Migración v1 → v2](./MIGRATION_v1_to_v2.md)
- [RFC 8594 - Sunset HTTP Header](https://www.rfc-editor.org/rfc/rfc8594.html)
- [RFC 7234 - HTTP Caching (Deprecation)](https://www.rfc-editor.org/rfc/rfc7234.html)
- [Best Practices for API Versioning](https://www.troyhunt.com/your-api-versioning-is-wrong-which-is/)

## Soporte

Para preguntas sobre migración o problemas con el versionado, contacta al equipo de backend:
- Email: backend@purezanaturalis.com
- Slack: #backend-support
- GitHub Issues: [pureza-naturalis-v3/issues](https://github.com/pureza-naturalis/pureza-naturalis-v3/issues)
