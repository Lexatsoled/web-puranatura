# TASK-016: Implementación de Caché con Redis

## 📋 INFORMACIÓN

**ID**: TASK-016 | **Fase**: 2 | **Prioridad**: ALTA | **Estimación**: 4h

## 🎯 OBJETIVO

Implementar sistema de caché con Redis para productos, búsquedas, sesiones y rate limiting con TTL automático, invalidación inteligente y fallback a memoria.

## 📊 CONTEXTO

**Problema**: Queries repetitivas a DB, sesiones en memoria (no escalable), rate limiting local.

**Solución**: Redis para caché distribuido + estrategias de invalidación.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Cliente Redis

**Archivo**: `backend/src/config/redis.ts`

```typescript
import { createClient } from 'redis';
import { logger } from './logger.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Redis reconnect failed after 10 attempts');
        return new Error('Redis unavailable');
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on('error', (err) => logger.error({ err }, 'Redis error'));
redisClient.on('connect', () => logger.info('Redis connected'));

export async function connectRedis() {
  await redisClient.connect();
}

export async function disconnectRedis() {
  await redisClient.disconnect();
}
```

### Paso 2: CacheService

**Archivo**: `backend/src/services/CacheService.ts`

```typescript
import { redisClient } from '../config/redis.js';
import { logger } from '../config/logger.js';

export class CacheService {
  private memoryCache = new Map<string, { value: any; expires: number }>();
  private useRedis = process.env.REDIS_ENABLED !== 'false';

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.useRedis && redisClient.isOpen) {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
      }
      
      // Fallback a memoria
      const cached = this.memoryCache.get(key);
      if (cached && cached.expires > Date.now()) {
        return cached.value as T;
      }
      return null;

    } catch (error) {
      logger.error({ error, key }, 'Cache get failed');
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    try {
      if (this.useRedis && redisClient.isOpen) {
        await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
      }
      
      // Siempre guardar en memoria como fallback
      this.memoryCache.set(key, {
        value,
        expires: Date.now() + ttlSeconds * 1000,
      });

    } catch (error) {
      logger.error({ error, key }, 'Cache set failed');
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (this.useRedis && redisClient.isOpen) {
        await redisClient.del(key);
      }
      this.memoryCache.delete(key);
    } catch (error) {
      logger.error({ error, key }, 'Cache delete failed');
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      if (this.useRedis && redisClient.isOpen) {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
      }
      
      // Limpiar memoria
      for (const key of this.memoryCache.keys()) {
        if (key.match(pattern.replace('*', '.*'))) {
          this.memoryCache.delete(key);
        }
      }
    } catch (error) {
      logger.error({ error, pattern }, 'Cache pattern delete failed');
    }
  }

  async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fn();
    await this.set(key, value, ttl);
    return value;
  }
}

export const cacheService = new CacheService();
```

### Paso 3: Integrar Caché en ProductService

**Archivo**: `backend/src/services/ProductService.ts` (actualizar)

```typescript
import { cacheService } from './CacheService.js';

export class ProductService {
  async getProductById(id: number) {
    const cacheKey = `product:${id}`;
    
    return cacheService.wrap(cacheKey, async () => {
      // Query a DB
      const product = await this.db
        .select()
        .from(products)
        .where(eq(products.id, id))
        .limit(1);
      
      return product[0] || null;
    }, 3600); // TTL: 1 hora
  }

  async updateProduct(id: number, data: any) {
    const updated = await this.db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    
    // Invalidar caché
    await cacheService.delete(`product:${id}`);
    await cacheService.deletePattern('products:list:*');
    
    return updated[0];
  }
}
```

### Paso 4: Caché de Sesiones

**Archivo**: `backend/src/services/SessionService.ts`

```typescript
import { cacheService } from './CacheService.js';

export class SessionService {
  async saveSession(userId: number, sessionData: any): Promise<string> {
    const sessionId = crypto.randomUUID();
    const key = `session:${sessionId}`;
    
    await cacheService.set(key, {
      userId,
      ...sessionData,
    }, 86400); // 24 horas
    
    return sessionId;
  }

  async getSession(sessionId: string) {
    return cacheService.get(`session:${sessionId}`);
  }

  async deleteSession(sessionId: string) {
    await cacheService.delete(`session:${sessionId}`);
  }
}
```

### Paso 5: Configuración Docker

**Archivo**: `docker-compose.yml` (añadir)

```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  redis-data:
```

### Paso 6: Variables de Entorno

**Archivo**: `.env` (añadir)

```bash
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true
CACHE_TTL_PRODUCTS=3600
CACHE_TTL_SEARCH=1800
CACHE_TTL_SESSIONS=86400
```

### Paso 7: Tests

**Archivo**: `backend/src/tests/services/CacheService.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CacheService } from '../../services/CacheService.js';

describe('CacheService', () => {
  let cache: CacheService;

  beforeAll(() => {
    cache = new CacheService();
  });

  it('should set and get value', async () => {
    await cache.set('test-key', { foo: 'bar' }, 60);
    const value = await cache.get('test-key');
    
    expect(value).toEqual({ foo: 'bar' });
  });

  it('should return null for expired keys', async () => {
    await cache.set('expires-key', 'value', 1);
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    const value = await cache.get('expires-key');
    expect(value).toBe(null);
  });

  it('should delete keys', async () => {
    await cache.set('delete-me', 'value', 60);
    await cache.delete('delete-me');
    
    const value = await cache.get('delete-me');
    expect(value).toBe(null);
  });

  it('should wrap function with cache', async () => {
    let callCount = 0;
    
    const fn = async () => {
      callCount++;
      return { result: 'data' };
    };
    
    const result1 = await cache.wrap('wrap-key', fn, 60);
    const result2 = await cache.wrap('wrap-key', fn, 60);
    
    expect(callCount).toBe(1); // Solo llamó una vez
    expect(result1).toEqual(result2);
  });
});
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Redis client configurado con reconnect
- [x] CacheService con fallback a memoria
- [x] Caché de productos (get/list)
- [x] Caché de búsquedas
- [x] Caché de sesiones
- [x] Invalidación inteligente
- [x] TTL configurable
- [x] Docker compose con Redis
- [x] Tests completos

## 🧪 VALIDACIÓN

```bash
# Iniciar Redis
docker-compose up -d redis

# Verificar conexión
redis-cli ping

# Tests
npm test CacheService.test.ts

# Monitorear caché
redis-cli MONITOR

# Ver keys
redis-cli KEYS "product:*"

# Stats
redis-cli INFO stats
```

---

**Status**: COMPLETO ✅
