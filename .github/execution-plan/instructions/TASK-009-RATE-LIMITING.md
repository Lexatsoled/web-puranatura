# TASK-009: Rate Limiting Granular por Endpoint y Usuario

**PRIORIDAD:** ALTA  
**FASE:** 1 - Seguridad  
**DEPENDENCIAS:** Ninguna  
**TIEMPO ESTIMADO:** 3-4 horas

---

## CONTEXTO

El proyecto tiene rate limiting básico global, pero NO implementa:

- **Rate limiting por usuario autenticado** (permitir más requests a usuarios legítimos)
- **Límites específicos por endpoint** (ej: login más restrictivo que búsqueda)
- **Throttling progresivo** (ralentizar en vez de bloquear completamente)
- **Whitelist de IPs** (para admin, bots aprobados)

**RIESGO:** Ataques de fuerza bruta, scraping, DoS pueden degradar servicio.

---

## OBJETIVO

Implementar sistema de rate limiting multi-capa:

1. **Global:** Límite base para toda la API
2. **Por endpoint:** Límites específicos (login, checkout, búsqueda)
3. **Por usuario:** Autenticados tienen límites más altos
4. **Memoria Redis:** Persistencia de contadores (opcional, usar in-memory si no hay Redis)
5. **Headers informativos:** `X-RateLimit-*` en respuestas

---

## INSTRUCCIONES DETALLADAS

### PASO 1: Instalar Dependencias

```bash
cd backend
npm install @fastify/rate-limit ioredis
npm install --save-dev @types/ioredis
```

---

### PASO 2: Configurar Redis (Opcional)

Si tienes Redis disponible:

**Archivo:** `backend/src/config/redis.ts` (crear)

```typescript
import Redis from 'ioredis';

/**
 * Cliente Redis para rate limiting
 */
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  lazyConnect: true,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

/**
 * Cerrar conexión al shutdown
 */
export async function closeRedis() {
  await redis.quit();
}
```

**Si NO tienes Redis:** Usar in-memory store (ver Paso 3).

---

### PASO 3: Configurar Rate Limiting Global

**Archivo:** `backend/src/plugins/rateLimit.ts` (crear/modificar)

```typescript
import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';
import { redis } from '../config/redis';

/**
 * Plugin de rate limiting con configuración avanzada
 */
export default fp(async function rateLimitPlugin(fastify: FastifyInstance) {
  // Configuración base
  const useRedis = process.env.REDIS_HOST !== undefined;

  await fastify.register(rateLimit, {
    global: true, // Aplicar a todas las rutas por defecto
    
    // Storage: Redis si disponible, in-memory si no
    redis: useRedis ? redis : undefined,
    
    // Límite global: 100 requests por minuto
    max: 100,
    timeWindow: '1 minute',
    
    // Headers informativos
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
    
    // Mensaje de error personalizado
    errorResponseBuilder: (req, context) => {
      return {
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
        retryAfter: context.ttl,
      };
    },
    
    // Key generator: por IP o por usuario si está autenticado
    keyGenerator: (req) => {
      // Si usuario autenticado, usar su ID
      if (req.user?.sub) {
        return `user:${req.user.sub}`;
      }
      
      // Si no, usar IP
      return req.ip;
    },
    
    // Skip rate limit para ciertas rutas
    skip: (req) => {
      const exemptPaths = [
        '/api/health',
        '/api/metrics',
      ];
      
      return exemptPaths.includes(req.routerPath);
    },
  });

  fastify.log.info('Rate limiting enabled');
}, {
  name: 'rate-limit',
});
```

---

### PASO 4: Configurar Límites por Endpoint

**Archivo:** `backend/src/config/rateLimitRules.ts` (crear)

```typescript
/**
 * Configuración de rate limits específicos por endpoint
 */

export const rateLimitRules = {
  // Auth endpoints (muy restrictivos)
  login: {
    max: 5,
    timeWindow: '15 minutes',
    errorMessage: 'Too many login attempts. Try again in 15 minutes.',
  },
  
  register: {
    max: 3,
    timeWindow: '1 hour',
    errorMessage: 'Too many registration attempts.',
  },
  
  forgotPassword: {
    max: 3,
    timeWindow: '1 hour',
    errorMessage: 'Too many password reset requests.',
  },
  
  // Checkout (crítico, pero usuarios legítimos necesitan flexibilidad)
  checkout: {
    max: 10,
    timeWindow: '10 minutes',
    errorMessage: 'Too many checkout attempts.',
  },
  
  // Búsqueda (más permisivo)
  search: {
    max: 60,
    timeWindow: '1 minute',
    errorMessage: 'Too many search requests.',
  },
  
  // API pública (productos, categorías)
  publicApi: {
    max: 100,
    timeWindow: '1 minute',
    errorMessage: 'Rate limit exceeded.',
  },
  
  // Uploads (muy restrictivo por tamaño)
  upload: {
    max: 10,
    timeWindow: '1 hour',
    errorMessage: 'Too many upload requests.',
  },
  
  // Admin (más permisivo para usuarios autenticados)
  admin: {
    max: 300,
    timeWindow: '1 minute',
    errorMessage: 'Admin rate limit exceeded.',
  },
};

/**
 * Helper para crear config de rate limit
 */
export function createRateLimitConfig(ruleName: keyof typeof rateLimitRules) {
  const rule = rateLimitRules[ruleName];
  
  return {
    max: rule.max,
    timeWindow: rule.timeWindow,
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: rule.errorMessage,
    }),
  };
}
```

---

### PASO 5: Aplicar Rate Limits a Rutas

**Archivo:** `backend/src/routes/auth.ts` (modificar)

```typescript
import { createRateLimitConfig } from '../config/rateLimitRules';

export default async function authRoutes(app: FastifyInstance) {
  app.post(
    '/login',
    {
      config: {
        rateLimit: createRateLimitConfig('login'),
      },
    },
    async (req, reply) => {
      // ... lógica de login ...
    }
  );

  app.post(
    '/register',
    {
      config: {
        rateLimit: createRateLimitConfig('register'),
      },
    },
    async (req, reply) => {
      // ... lógica de registro ...
    }
  );

  app.post(
    '/forgot-password',
    {
      config: {
        rateLimit: createRateLimitConfig('forgotPassword'),
      },
    },
    async (req, reply) => {
      // ... lógica de reset password ...
    }
  );
}
```

**Archivo:** `backend/src/routes/orders.ts` (modificar)

```typescript
app.post(
  '/orders',
  {
    config: {
      rateLimit: createRateLimitConfig('checkout'),
    },
    preHandler: [authenticateUser],
  },
  async (req, reply) => {
    // ... crear order ...
  }
);
```

**Archivo:** `backend/src/routes/products.ts` (modificar)

```typescript
app.get(
  '/products',
  {
    config: {
      rateLimit: createRateLimitConfig('search'),
    },
  },
  async (req, reply) => {
    // ... búsqueda de productos ...
  }
);
```

---

### PASO 6: Rate Limiting Diferenciado por Usuario

**Archivo:** `backend/src/plugins/rateLimit.ts` (modificar)

Actualizar `keyGenerator` para dar más capacidad a usuarios autenticados:

```typescript
keyGenerator: (req) => {
  if (req.user?.sub) {
    // Usuarios autenticados: límite más alto
    return `user:${req.user.sub}`;
  }
  
  // Anónimos: límite más restrictivo
  return `anon:${req.ip}`;
},

// Límite dinámico según usuario
max: async (req, key) => {
  // Usuarios autenticados
  if (key.startsWith('user:')) {
    return 200; // 200 req/min
  }
  
  // Anónimos
  return 100; // 100 req/min
},
```

---

### PASO 7: Whitelist de IPs (Admin/Bots Aprobados)

**Archivo:** `backend/.env.example` (añadir)

```env
# Rate Limiting
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Whitelist de IPs (separadas por comas)
RATE_LIMIT_WHITELIST=127.0.0.1,::1
```

**Archivo:** `backend/src/plugins/rateLimit.ts` (modificar)

```typescript
// Parsear whitelist
const whitelist = (process.env.RATE_LIMIT_WHITELIST || '')
  .split(',')
  .map(ip => ip.trim())
  .filter(Boolean);

// Skip rate limit para IPs whitelisted
skip: (req) => {
  // IPs whitelisted
  if (whitelist.includes(req.ip)) {
    return true;
  }
  
  // Rutas exempt
  const exemptPaths = ['/api/health', '/api/metrics'];
  return exemptPaths.includes(req.routerPath);
},
```

---

### PASO 8: Logging de Rate Limit Violations

**Archivo:** `backend/src/plugins/rateLimit.ts` (modificar)

```typescript
import { logger } from '../utils/logger';

// Hook para loggear cuando se excede límite
fastify.addHook('onSend', async (req, reply) => {
  if (reply.statusCode === 429) {
    logger.warn({
      msg: 'Rate limit exceeded',
      ip: req.ip,
      user: req.user?.sub,
      path: req.routerPath,
      method: req.method,
    });
  }
});
```

---

### PASO 9: Monitoreo y Métricas

**Archivo:** `backend/src/routes/admin.ts` (crear endpoint)

```typescript
import { redis } from '../config/redis';

export default async function adminRoutes(app: FastifyInstance) {
  /**
   * GET /api/admin/rate-limit-stats
   * 
   * Ver estadísticas de rate limiting
   */
  app.get(
    '/admin/rate-limit-stats',
    {
      preHandler: [authenticateUser, requireRole('admin')],
    },
    async (req, reply) => {
      const useRedis = process.env.REDIS_HOST !== undefined;
      
      if (!useRedis) {
        return { error: 'Redis not configured' };
      }

      // Obtener keys de rate limiting
      const keys = await redis.keys('fastify-rate-limit:*');
      
      const stats = await Promise.all(
        keys.map(async (key) => {
          const ttl = await redis.ttl(key);
          const value = await redis.get(key);
          
          return {
            key: key.replace('fastify-rate-limit:', ''),
            requests: parseInt(value || '0'),
            resetIn: ttl,
          };
        })
      );

      // Ordenar por más requests
      stats.sort((a, b) => b.requests - a.requests);

      return {
        total: stats.length,
        topAbusers: stats.slice(0, 10),
      };
    }
  );

  /**
   * DELETE /api/admin/rate-limit-reset/:identifier
   * 
   * Resetear rate limit de un usuario/IP específico
   */
  app.delete(
    '/admin/rate-limit-reset/:identifier',
    {
      preHandler: [authenticateUser, requireRole('admin')],
    },
    async (req, reply) => {
      const { identifier } = req.params as { identifier: string };

      const useRedis = process.env.REDIS_HOST !== undefined;
      if (!useRedis) {
        return reply.code(400).send({ error: 'Redis not configured' });
      }

      const key = `fastify-rate-limit:${identifier}`;
      await redis.del(key);

      return { message: 'Rate limit reset successfully' };
    }
  );
}
```

---

### PASO 10: Tests de Rate Limiting

**Archivo:** `backend/src/routes/__tests__/rateLimit.test.ts` (crear)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { build } from '../app';
import type { FastifyInstance } from 'fastify';

describe('Rate Limiting', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await build();
    await app.ready();
  });

  it('should block after exceeding login rate limit', async () => {
    const credentials = { email: 'test@test.com', password: 'wrong' };

    // Hacer 5 requests (límite de login)
    for (let i = 0; i < 5; i++) {
      await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: credentials,
      });
    }

    // Request #6 debe ser bloqueada
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: credentials,
    });

    expect(response.statusCode).toBe(429);
    expect(response.json()).toHaveProperty('error', 'Too Many Requests');
  });

  it('should include rate limit headers', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/products',
    });

    expect(response.headers).toHaveProperty('x-ratelimit-limit');
    expect(response.headers).toHaveProperty('x-ratelimit-remaining');
    expect(response.headers).toHaveProperty('x-ratelimit-reset');
  });

  it('should allow more requests for authenticated users', async () => {
    // Login
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: 'user@test.com', password: 'password' },
    });

    const { accessToken } = loginResponse.json();

    // Usuarios autenticados tienen límite más alto
    // Hacer 150 requests (más que el límite anónimo de 100)
    let successCount = 0;
    for (let i = 0; i < 150; i++) {
      const response = await app.inject({
        method: 'GET',
        url: '/api/products',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.statusCode === 200) {
        successCount++;
      }
    }

    // Debería permitir al menos 100+ requests
    expect(successCount).toBeGreaterThan(100);
  });

  it('should reset rate limit after time window', async () => {
    // Exceder límite
    for (let i = 0; i < 6; i++) {
      await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'test@test.com', password: 'wrong' },
      });
    }

    // Esperar reset (en producción sería 15 minutos, en test usar mock)
    // ... (implementar con fake timers o mock de Redis)

    // Verificar que se resetea
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: 'test@test.com', password: 'wrong' },
    });

    expect(response.statusCode).toBe(401); // No 429
  });
});
```

---

### PASO 11: Documentar Rate Limits

**Archivo:** `docs/API_RATE_LIMITS.md` (crear)

```markdown
# Rate Limits de API

## Límites Globales

### Usuarios Anónimos

- **Límite:** 100 requests por minuto
- **Identificación:** Por IP

### Usuarios Autenticados

- **Límite:** 200 requests por minuto
- **Identificación:** Por user ID

---

## Límites por Endpoint

| Endpoint | Anónimo | Autenticado | Ventana |
|----------|---------|-------------|---------|
| `POST /api/auth/login` | 5 | N/A | 15 min |
| `POST /api/auth/register` | 3 | N/A | 1 hora |
| `POST /api/auth/forgot-password` | 3 | N/A | 1 hora |
| `POST /api/orders` | N/A | 10 | 10 min |
| `GET /api/products` | 60 | 100 | 1 min |
| `POST /api/uploads` | 5 | 10 | 1 hora |
| Admin endpoints | N/A | 300 | 1 min |

---

## Headers de Respuesta

Cada respuesta incluye headers informativos:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1699999999
```

- `X-RateLimit-Limit`: Número máximo de requests permitidos
- `X-RateLimit-Remaining`: Requests restantes en ventana actual
- `X-RateLimit-Reset`: Timestamp UNIX cuando se resetea el límite

---

## Error 429 - Too Many Requests

```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 45 seconds.",
  "retryAfter": 45
}
```

**Acción del cliente:**
- Esperar tiempo indicado en `retryAfter`
- Implementar backoff exponencial
- Reducir frecuencia de requests

---

## Whitelist

Algunas IPs están exentas de rate limiting:

- Localhost (desarrollo)
- IPs de admin (configuradas en servidor)
- Bots aprobados (ej: healthcheck services)

Para solicitar whitelist, contactar administrador.

---

## Mejores Prácticas

1. **Cachear respuestas** en cliente para reducir requests
2. **Implementar backoff** exponencial si recibes 429
3. **Usar WebSockets** para actualizaciones en tiempo real (no cuenta para rate limit)
4. **Autenticarse** para obtener límites más altos
5. **Respetar headers** `X-RateLimit-*`

---

## FAQ

### ¿Por qué estoy siendo bloqueado?

- Estás excediendo el límite de requests
- Verifica headers `X-RateLimit-*` en respuestas
- Espera tiempo indicado en `retryAfter`

### ¿Cómo obtener límites más altos?

- Autentícate (usuarios auth tienen 2x límite)
- Contacta admin para whitelist si eres servicio legítimo

### ¿El rate limit es por IP o por usuario?

- Anónimos: Por IP
- Autenticados: Por user ID

---

*Para reportar problemas, abrir issue en GitHub.*
```

---

## VALIDACIÓN

### ✅ Criterios de Aceptación

1. **Rate limiting configurado:**
   - [ ] Global: 100 req/min anónimos, 200 autenticados
   - [ ] Login: 5 req/15min
   - [ ] Checkout: 10 req/10min
   - [ ] Búsqueda: 60 req/min

2. **Headers informativos:**
   - [ ] `X-RateLimit-Limit`
   - [ ] `X-RateLimit-Remaining`
   - [ ] `X-RateLimit-Reset`

3. **Funcionalidades:**
   - [ ] Whitelist de IPs funcional
   - [ ] Logging de violations
   - [ ] Endpoint admin de estadísticas

4. **Tests:**
   - [ ] Tests de límites pasando
   - [ ] Verificación de reset

### 🧪 Tests de Validación

```bash
# Tests automatizados
cd backend
npm run test -- rateLimit.test.ts

# Test manual - Exceder límite de login
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Esperado: Últimos requests retornan 429

# Verificar headers
curl -I http://localhost:3000/api/products
# Esperado: X-RateLimit-* headers presentes
```

### 📊 Métricas de Éxito

- **Protección:** 0 ataques de fuerza bruta exitosos
- **Usabilidad:** <1% usuarios legítimos bloqueados
- **Performance:** <1ms overhead por request

---

## NOTAS IMPORTANTES

### ⚠️ Avisos

1. **Redis recomendado:** In-memory store se resetea al reiniciar servidor
2. **Producción:** Ajustar límites según tráfico real
3. **Clustering:** Si usas múltiples instancias, Redis es OBLIGATORIO

### 🔗 Dependencias

- **Requiere:** Fastify
- **Opcional:** Redis (recomendado para producción)
- **Habilita:** Protección contra abuse, DoS

### 📦 Entregables

- `backend/src/plugins/rateLimit.ts`
- `backend/src/config/rateLimitRules.ts`
- `backend/src/config/redis.ts`
- `backend/src/routes/admin.ts` (endpoints stats)
- `docs/API_RATE_LIMITS.md`

---

**FIN DE INSTRUCCIONES TASK-009**
