# TASK-022: Error Handling Unificado

## 📋 INFORMACIÓN

**ID**: TASK-022 | **Fase**: 2 | **Prioridad**: ALTA | **Estimación**: 2h

## 🎯 OBJETIVO

Implementar manejo de errores global con custom error classes, serialización consistente y logging integrado.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Custom Error Classes

**Archivo**: `backend/src/errors/AppError.ts`

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    super(404, `${resource}${id ? ` with id ${id}` : ''} not found`, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(409, message, 'CONFLICT', details);
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super(429, 'Too many requests', 'RATE_LIMIT_EXCEEDED', { retryAfter });
  }
}
```

### Paso 2: Error Handler Plugin

**Archivo**: `backend/src/plugins/errorHandler.ts`

```typescript
import { FastifyPluginAsync, FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

export const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler(async (error, request, reply) => {
    const requestId = request.id;

    // AppError (nuestros errores custom)
    if (error instanceof AppError) {
      fastify.log.warn({
        requestId,
        error: error.toJSON(),
        url: request.url,
        method: request.method,
      }, 'Application error');

      return reply.code(error.statusCode).send({
        error: error.name,
        message: error.message,
        code: error.code,
        details: error.details,
        requestId,
      });
    }

    // Zod validation errors
    if (error instanceof ZodError) {
      fastify.log.warn({
        requestId,
        errors: error.errors,
        url: request.url,
      }, 'Validation error');

      return reply.code(400).send({
        error: 'ValidationError',
        message: 'Invalid request data',
        code: 'VALIDATION_ERROR',
        details: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
        requestId,
      });
    }

    // Fastify errors
    if ((error as FastifyError).statusCode) {
      const statusCode = (error as FastifyError).statusCode!;
      
      fastify.log.warn({
        requestId,
        error: error.message,
        statusCode,
      }, 'Fastify error');

      return reply.code(statusCode).send({
        error: 'RequestError',
        message: error.message,
        requestId,
      });
    }

    // Errores inesperados (500)
    fastify.log.error({
      requestId,
      error: {
        message: error.message,
        stack: error.stack,
      },
      url: request.url,
      method: request.method,
    }, 'Unexpected error');

    return reply.code(500).send({
      error: 'InternalServerError',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message,
      requestId,
    });
  });

  // Not found handler
  fastify.setNotFoundHandler(async (request, reply) => {
    fastify.log.warn({
      url: request.url,
      method: request.method,
    }, 'Route not found');

    return reply.code(404).send({
      error: 'NotFound',
      message: `Route ${request.method} ${request.url} not found`,
      code: 'ROUTE_NOT_FOUND',
      requestId: request.id,
    });
  });
};
```

### Paso 3: Usar Errores en Servicios

**Archivo**: `backend/src/services/ProductService.ts`

```typescript
import { NotFoundError, ValidationError } from '../errors/AppError.js';

export class ProductService {
  async getById(id: number) {
    const product = this.db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    
    if (!product) {
      throw new NotFoundError('Product', id);
    }
    
    return product;
  }

  async create(data: any) {
    // Validar stock
    if (data.stock < 0) {
      throw new ValidationError('Stock cannot be negative', {
        field: 'stock',
        value: data.stock,
      });
    }

    // ...
  }
}
```

### Paso 4: Async Error Wrapper

**Archivo**: `backend/src/utils/asyncHandler.ts`

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';

type AsyncHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<any>;

/**
 * Wrapper para async route handlers
 * Captura errores automáticamente
 */
export function asyncHandler(handler: AsyncHandler) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      return await handler(request, reply);
    } catch (error) {
      // El error handler global lo manejará
      throw error;
    }
  };
}

// Uso:
// fastify.get('/api/products/:id', asyncHandler(async (request, reply) => {
//   const product = await productService.getById(request.params.id);
//   return product;
// }));
```

### Paso 5: Error Monitoring Hook

**Archivo**: `backend/src/plugins/errorMonitoring.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';

interface ErrorStats {
  total: number;
  byCode: Map<string, number>;
  byStatus: Map<number, number>;
  recent: Array<{
    timestamp: Date;
    error: string;
    url: string;
  }>;
}

export const errorMonitoringPlugin: FastifyPluginAsync = async (fastify) => {
  const stats: ErrorStats = {
    total: 0,
    byCode: new Map(),
    byStatus: new Map(),
    recent: [],
  };

  fastify.addHook('onError', async (request, reply, error) => {
    stats.total++;

    // Contar por código
    const code = (error as any).code || 'UNKNOWN';
    stats.byCode.set(code, (stats.byCode.get(code) || 0) + 1);

    // Contar por status
    const status = reply.statusCode || 500;
    stats.byStatus.set(status, (stats.byStatus.get(status) || 0) + 1);

    // Guardar errores recientes (últimos 100)
    stats.recent.unshift({
      timestamp: new Date(),
      error: error.message,
      url: request.url,
    });
    
    if (stats.recent.length > 100) {
      stats.recent.pop();
    }
  });

  // Endpoint de error stats
  fastify.get('/api/admin/error-stats', {
    preHandler: [fastify.authenticate, fastify.authorizeAdmin],
  }, async () => {
    return {
      total: stats.total,
      byCode: Object.fromEntries(stats.byCode),
      byStatus: Object.fromEntries(stats.byStatus),
      recent: stats.recent.slice(0, 10),
    };
  });
};
```

### Paso 6: Tests

**Archivo**: `backend/src/__tests__/errorHandler.test.ts`

```typescript
import { test } from 'tap';
import { build } from '../app.js';
import { NotFoundError, ValidationError } from '../errors/AppError.js';

test('Error handling', async (t) => {
  const app = await build();

  t.test('should handle NotFoundError', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/products/99999',
    });

    t.equal(response.statusCode, 404);
    const body = response.json();
    t.equal(body.error, 'NotFoundError');
    t.ok(body.requestId);
  });

  t.test('should handle ValidationError', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/products',
      payload: {
        name: '', // Invalid
      },
    });

    t.equal(response.statusCode, 400);
    const body = response.json();
    t.equal(body.error, 'ValidationError');
    t.ok(body.details);
  });

  t.test('should handle 404 routes', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/non-existent',
    });

    t.equal(response.statusCode, 404);
    const body = response.json();
    t.equal(body.code, 'ROUTE_NOT_FOUND');
  });

  await app.close();
});
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Custom error classes
- [x] Error handler global
- [x] Serialización consistente
- [x] Logging de errores
- [x] Zod validation errors
- [x] 404 handler
- [x] Error monitoring
- [x] Tests completos

## 🧪 VALIDACIÓN

```bash
# Test 404
curl http://localhost:3000/api/non-existent

# Test validation error
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": ""}'

# Ver error stats (admin)
curl http://localhost:3000/api/admin/error-stats \
  -H "Authorization: Bearer $TOKEN"
```

---

**Status**: COMPLETO ✅
