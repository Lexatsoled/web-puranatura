# API Reference

## Base URL

```
https://api.purezanaturalis.com
```

## Authentication

La API utiliza autenticación JWT (JSON Web Tokens). Los endpoints que requieren autenticación deben incluir el token en el header `Authorization`.

### Header Format

```
Authorization: Bearer <jwt-token>
```

### Obtaining a Token

Los tokens se obtienen mediante el endpoint de login:

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "<jwt-token>",
    "refreshToken": "<refresh-token>",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Token Refresh

```bash
POST /auth/refresh
Authorization: Bearer <refresh-token>
```

## Endpoints

### GET /api/products

Obtiene una lista paginada de productos.

#### Query Parameters

- `page` (number, optional): Número de página (default: 1)
- `limit` (number, optional): Número de productos por página (default: 20, max: 100)
- `category` (string, optional): Filtrar por categoría
- `sort` (string, optional): Campo para ordenar (name, price, created_at)
- `order` (string, optional): Dirección del orden (asc, desc)

#### Example Request

```bash
GET /api/products?page=1&limit=10&category=supplements&sort=price&order=asc
```

#### Response

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Vitamina C 1000mg",
        "description": "Suplemento de vitamina C natural",
        "price": 29.99,
        "category": "supplements",
        "stock_quantity": 150,
        "image_url": "https://cdn.bunny.net/images/vitamin-c.jpg",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

#### Status Codes

- `200`: Success
- `400`: Invalid query parameters
- `500`: Internal server error

### GET /api/products/:id

Obtiene los detalles de un producto específico.

#### Path Parameters

- `id` (number, required): ID del producto

#### Example Request

```bash
GET /api/products/1
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Vitamina C 1000mg",
    "description": "Suplemento de vitamina C natural de alta calidad",
    "price": 29.99,
    "category": "supplements",
    "stock_quantity": 150,
    "image_url": "https://cdn.bunny.net/images/vitamin-c.jpg",
    "ingredients": [
      {
        "name": "Ácido Ascórbico",
        "amount": "1000mg",
        "description": "Vitamina C pura"
      }
    ],
    "scientific_references": [
      {
        "title": "Vitamin C and Immune Function",
        "authors": "Carr AC, Maggini S",
        "journal": "Nutrients",
        "year": 2017,
        "doi": "10.3390/nu9111211",
        "url": "https://pubmed.ncbi.nlm.nih.gov/29099763/"
      }
    ],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Status Codes

- `200`: Success
- `404`: Product not found
- `500`: Internal server error

### POST /api/orders

Crea una nueva orden de compra. **Requiere autenticación.**

#### Headers

```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### Request Body

```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ],
  "shipping_address": {
    "street": "Calle Principal 123",
    "city": "Madrid",
    "postal_code": "28001",
    "country": "Spain"
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": 123,
    "user_id": 1,
    "status": "pending",
    "total_amount": 89.97,
    "items": [
      {
        "product_id": 1,
        "product_name": "Vitamina C 1000mg",
        "quantity": 2,
        "unit_price": 29.99,
        "total_price": 59.98
      },
      {
        "product_id": 3,
        "product_name": "Omega 3",
        "quantity": 1,
        "unit_price": 29.99,
        "total_price": 29.99
      }
    ],
    "shipping_address": {
      "street": "Calle Principal 123",
      "city": "Madrid",
      "postal_code": "28001",
      "country": "Spain"
    },
    "created_at": "2024-01-20T14:30:00Z",
    "updated_at": "2024-01-20T14:30:00Z"
  }
}
```

#### Status Codes

- `201`: Order created successfully
- `400`: Invalid request data
- `401`: Unauthorized
- `422`: Validation error (insufficient stock, etc.)
- `500`: Internal server error

### GET /api/search

Busca productos por texto. **No requiere autenticación.**

#### Query Parameters

- `q` (string, required): Término de búsqueda
- `limit` (number, optional): Número máximo de resultados (default: 20, max: 50)

#### Example Request

```bash
GET /api/search?q=vitamina&limit=10
```

#### Response

```json
{
  "success": true,
  "data": {
    "query": "vitamina",
    "results": [
      {
        "id": 1,
        "name": "Vitamina C 1000mg",
        "description": "Suplemento de vitamina C natural",
        "price": 29.99,
        "category": "supplements",
        "image_url": "https://cdn.bunny.net/images/vitamin-c.jpg",
        "relevance_score": 0.95
      },
      {
        "id": 5,
        "name": "Complejo Vitamínico B",
        "description": "Complejo de vitaminas B naturales",
        "price": 34.99,
        "category": "supplements",
        "image_url": "https://cdn.bunny.net/images/vitamin-b.jpg",
        "relevance_score": 0.87
      }
    ],
    "total": 2
  }
}
```

#### Status Codes

- `200`: Success
- `400`: Missing or invalid query parameter
- `500`: Internal server error

### GET /api/categories

Obtiene todas las categorías disponibles.

#### Example Request

```bash
GET /api/categories
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "supplements",
      "display_name": "Suplementos",
      "description": "Vitaminas y minerales naturales"
    },
    {
      "id": 2,
      "name": "herbs",
      "display_name": "Hierbas",
      "description": "Hierbas medicinales y adaptógenas"
    }
  ]
}
```

#### Status Codes

- `200`: Success
- `500`: Internal server error

### GET /api/user/orders

Obtiene las órdenes del usuario autenticado. **Requiere autenticación.**

#### Headers

```
Authorization: Bearer <jwt-token>
```

#### Query Parameters

- `page` (number, optional): Número de página (default: 1)
- `limit` (number, optional): Órdenes por página (default: 10)

#### Example Request

```bash
GET /api/user/orders?page=1&limit=5
```

#### Response

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 123,
        "status": "completed",
        "total_amount": 89.97,
        "created_at": "2024-01-20T14:30:00Z",
        "items_count": 3
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 12,
      "totalPages": 3
    }
  }
}
```

#### Status Codes

- `200`: Success
- `401`: Unauthorized
- `500`: Internal server error

## Error Responses

Todos los errores siguen el mismo formato JSON:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados no son válidos",
    "details": {
      "field": "email",
      "reason": "Formato de email inválido"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Datos de entrada inválidos
- `UNAUTHORIZED`: Token faltante o inválido
- `FORBIDDEN`: Permisos insuficientes
- `NOT_FOUND`: Recurso no encontrado
- `CONFLICT`: Conflicto con estado actual
- `RATE_LIMIT_EXCEEDED`: Límite de requests excedido
- `INTERNAL_ERROR`: Error interno del servidor

## Rate Limits

La API implementa límites de rate para prevenir abuso:

### Límite para usuarios autenticados

- **1000 requests por hora** por usuario
- Aplicado por IP + User ID

### Límite para usuarios no autenticados

- **100 requests por hora** por IP
- Aplicado solo por IP

### Headers de Rate Limit

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 3600
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Límite de requests excedido",
    "details": {
      "retry_after": 3600,
      "limit": 1000,
      "remaining": 0
    }
  }
}
```

## Pagination

Los endpoints que retornan listas implementan paginación consistente:

```json
{
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

## Validation

La API utiliza validación estricta con Zod. Los errores de validación incluyen detalles específicos:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos de entrada inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email debe ser válido"
      },
      {
        "field": "password",
        "message": "Contraseña debe tener al menos 8 caracteres"
      }
    ]
  }
}
```

## Versioning

La API utiliza versioning en la URL:

- **v1 (actual)**: `https://api.purezanaturalis.com/api/`
- Futuras versiones: `https://api.purezanaturalis.com/v2/api/`

## SDKs y Librerías

### JavaScript/TypeScript Client

```javascript
import { PurezaAPI } from '@pureza/api-client';

const client = new PurezaAPI({
  baseURL: 'https://api.purezanaturalis.com',
  token: 'your-jwt-token',
});

// Ejemplos de uso
const products = await client.products.list({ page: 1, limit: 10 });
const product = await client.products.get(1);
const order = await client.orders.create(orderData);
```

### cURL Examples

```bash
# Login
curl -X POST https://api.purezanaturalis.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Get products
curl https://api.purezanaturalis.com/api/products

# Create order (authenticated)
curl -X POST https://api.purezanaturalis.com/api/orders \
  -H "Authorization: Bearer <jwt-token-placeholder>" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"product_id":1,"quantity":1}]}'
```
