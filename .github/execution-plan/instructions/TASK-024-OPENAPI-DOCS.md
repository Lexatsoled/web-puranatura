# TASK-024: Documentación API con OpenAPI

## 📋 INFORMACIÓN

**ID**: TASK-024 | **Fase**: 2 | **Prioridad**: MEDIA | **Estimación**: 3h

## 🎯 OBJETIVO

Generar documentación OpenAPI 3.0 automática con Swagger UI.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Instalar Dependencias

```bash
npm install --save @fastify/swagger @fastify/swagger-ui
npm install --save-dev @types/swagger-ui-dist
```

### Paso 2: Plugin de Swagger

**Archivo**: `backend/src/plugins/swagger.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

export const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Pureza Naturalis API',
        description: 'API REST para ecommerce de productos naturales',
        version: '1.0.0',
        contact: {
          name: 'Pureza Naturalis',
          url: 'https://purezanaturalis.com',
          email: 'api@purezanaturalis.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development',
        },
        {
          url: 'https://api.purezanaturalis.com',
          description: 'Production',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Auth', description: 'Autenticación y autorización' },
        { name: 'Products', description: 'Gestión de productos' },
        { name: 'Orders', description: 'Gestión de pedidos' },
        { name: 'Users', description: 'Gestión de usuarios' },
        { name: 'Search', description: 'Búsqueda de productos' },
      ],
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
  });

  fastify.log.info('Swagger UI available at /docs');
};
```

### Paso 3: Documentar Rutas

**Archivo**: `backend/src/routes/products.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';

export const productRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/products
  fastify.get('/api/products', {
    schema: {
      description: 'Listar productos con filtros y paginación',
      tags: ['Products'],
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          cursor: { type: 'string' },
          category: { type: 'string' },
          priceMin: { type: 'number' },
          priceMax: { type: 'number' },
          inStock: { type: 'boolean' },
          search: { type: 'string' },
          sortBy: { type: 'string', enum: ['price', 'name', 'createdAt'] },
          sortDir: { type: 'string', enum: ['asc', 'desc'] },
        },
      },
      response: {
        200: {
          description: 'Lista de productos',
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: 'Product#' },
            },
            pagination: {
              type: 'object',
              properties: {
                nextCursor: { type: 'string', nullable: true },
                hasMore: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  }, async (request) => {
    return productService.list(request.query);
  });

  // POST /api/products
  fastify.post('/api/products', {
    schema: {
      description: 'Crear nuevo producto (admin)',
      tags: ['Products'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'price', 'stock', 'category'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 200 },
          description: { type: 'string', maxLength: 2000 },
          price: { type: 'number', minimum: 0 },
          stock: { type: 'integer', minimum: 0 },
          category: { 
            type: 'string', 
            enum: ['vitaminas', 'minerales', 'suplementos', 'hierbas', 'aceites'] 
          },
          images: { 
            type: 'array', 
            items: { type: 'string', format: 'uri' },
            maxItems: 10,
          },
          tags: {
            type: 'array',
            items: { type: 'string', maxLength: 50 },
            maxItems: 20,
          },
        },
      },
      response: {
        201: {
          description: 'Producto creado',
          $ref: 'Product#',
        },
        401: { $ref: 'UnauthorizedError#' },
        403: { $ref: 'ForbiddenError#' },
      },
    },
    preHandler: [fastify.authenticate, fastify.authorizeAdmin],
  }, async (request, reply) => {
    const product = await productService.create(request.body);
    return reply.code(201).send(product);
  });

  // GET /api/products/:id
  fastify.get('/api/products/:id', {
    schema: {
      description: 'Obtener producto por ID',
      tags: ['Products'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer', minimum: 1 },
        },
      },
      response: {
        200: { $ref: 'Product#' },
        404: { $ref: 'NotFoundError#' },
      },
    },
  }, async (request) => {
    return productService.getById(request.params.id);
  });
};
```

### Paso 4: Schemas Compartidos

**Archivo**: `backend/src/schemas/openapi.ts`

```typescript
export const openAPISchemas = {
  Product: {
    $id: 'Product',
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      stock: { type: 'integer' },
      category: { type: 'string' },
      images: { type: 'array', items: { type: 'string' } },
      tags: { type: 'array', items: { type: 'string' } },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  User: {
    $id: 'User',
    type: 'object',
    properties: {
      id: { type: 'integer' },
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
      role: { type: 'string', enum: ['user', 'admin'] },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },

  Order: {
    $id: 'Order',
    type: 'object',
    properties: {
      id: { type: 'integer' },
      userId: { type: 'integer' },
      status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] },
      totalAmount: { type: 'number' },
      shippingCost: { type: 'number' },
      items: {
        type: 'array',
        items: { $ref: 'OrderItem#' },
      },
      shippingAddress: { $ref: 'Address#' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },

  OrderItem: {
    $id: 'OrderItem',
    type: 'object',
    properties: {
      productId: { type: 'integer' },
      quantity: { type: 'integer' },
      price: { type: 'number' },
    },
  },

  Address: {
    $id: 'Address',
    type: 'object',
    properties: {
      street: { type: 'string' },
      city: { type: 'string' },
      postalCode: { type: 'string' },
      country: { type: 'string' },
    },
  },

  // Error schemas
  NotFoundError: {
    $id: 'NotFoundError',
    type: 'object',
    properties: {
      error: { type: 'string', example: 'NotFoundError' },
      message: { type: 'string' },
      code: { type: 'string', example: 'NOT_FOUND' },
      requestId: { type: 'string' },
    },
  },

  ValidationError: {
    $id: 'ValidationError',
    type: 'object',
    properties: {
      error: { type: 'string', example: 'ValidationError' },
      message: { type: 'string' },
      code: { type: 'string', example: 'VALIDATION_ERROR' },
      details: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            path: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
      requestId: { type: 'string' },
    },
  },

  UnauthorizedError: {
    $id: 'UnauthorizedError',
    type: 'object',
    properties: {
      error: { type: 'string', example: 'UnauthorizedError' },
      message: { type: 'string' },
      code: { type: 'string', example: 'UNAUTHORIZED' },
      requestId: { type: 'string' },
    },
  },

  ForbiddenError: {
    $id: 'ForbiddenError',
    type: 'object',
    properties: {
      error: { type: 'string', example: 'ForbiddenError' },
      message: { type: 'string' },
      code: { type: 'string', example: 'FORBIDDEN' },
      requestId: { type: 'string' },
    },
  },
};

// Registrar todos los schemas
export function registerOpenAPISchemas(fastify: any) {
  for (const schema of Object.values(openAPISchemas)) {
    fastify.addSchema(schema);
  }
}
```

### Paso 5: Endpoint para Exportar

**Archivo**: `backend/src/routes/openapi.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import { writeFile } from 'fs/promises';

export const openapiRoutes: FastifyPluginAsync = async (fastify) => {
  // Endpoint para descargar OpenAPI JSON
  fastify.get('/api/openapi.json', async () => {
    return fastify.swagger();
  });

  // Endpoint para descargar OpenAPI YAML
  fastify.get('/api/openapi.yaml', async (request, reply) => {
    const yaml = fastify.swagger({ yaml: true });
    reply.type('text/yaml');
    return yaml;
  });

  // Exportar a archivo (admin)
  fastify.post('/api/admin/export-openapi', {
    preHandler: [fastify.authenticate, fastify.authorizeAdmin],
  }, async () => {
    const spec = fastify.swagger();
    await writeFile('./openapi.json', JSON.stringify(spec, null, 2));
    return { message: 'OpenAPI spec exported to openapi.json' };
  });
};
```

### Paso 6: Script de Generación

**Archivo**: `scripts/generate-openapi.ts`

```typescript
#!/usr/bin/env node
import { writeFile } from 'fs/promises';
import { build } from '../backend/src/app.js';

async function generateOpenAPI() {
  const app = await build();
  
  // Generar JSON
  const jsonSpec = app.swagger();
  await writeFile('./openapi.json', JSON.stringify(jsonSpec, null, 2));
  console.log('✅ OpenAPI JSON saved to openapi.json');

  // Generar YAML
  const yamlSpec = app.swagger({ yaml: true });
  await writeFile('./openapi.yaml', yamlSpec);
  console.log('✅ OpenAPI YAML saved to openapi.yaml');

  await app.close();
}

generateOpenAPI();
```

### Paso 7: Añadir a package.json

```json
{
  "scripts": {
    "docs:generate": "tsx scripts/generate-openapi.ts",
    "docs:serve": "redocly preview-docs openapi.yaml"
  }
}
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Swagger UI en /docs
- [x] Todas las rutas documentadas
- [x] Schemas compartidos
- [x] Security schemes (JWT)
- [x] Ejemplos de respuestas
- [x] Exportar JSON/YAML
- [x] Script de generación

## 🧪 VALIDACIÓN

```bash
# Ver documentación
open http://localhost:3000/docs

# Descargar OpenAPI JSON
curl http://localhost:3000/api/openapi.json > openapi.json

# Descargar OpenAPI YAML
curl http://localhost:3000/api/openapi.yaml > openapi.yaml

# Generar archivos
npm run docs:generate

# Validar spec
npx @redocly/cli lint openapi.yaml
```

---

**Status**: COMPLETO ✅  
**Fase 2**: COMPLETADA ✅ (12/12 tareas)
