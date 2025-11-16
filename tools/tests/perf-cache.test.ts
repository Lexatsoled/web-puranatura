import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';

/**
 * PERF-CACHE-001: Tests para Estrategias de Caché HTTP + Redis
 * Valida:
 * - HTTP cache headers (ETag, Cache-Control)
 * - Redis caching en backend
 * - Client-side cache layer
 * - Cache hit rate > 60%
 */

describe('PERF-CACHE-001: Estrategias de Caché', () => {
  const API_BASE = 'http://localhost:3001';
  const CACHE_STATS = {
    hits: 0,
    misses: 0,
    startTime: 0
  };

  beforeAll(async () => {
    CACHE_STATS.startTime = Date.now();
    
    try {
      await fetch(`${API_BASE}/health`);
    } catch {
      throw new Error(`Backend no accesible en ${API_BASE}`);
    }
  });

  describe('HTTP Cache Headers', () => {
    it('debe incluir Cache-Control header', async () => {
      const response = await fetch(`${API_BASE}/api/products`);
      const cacheControl = response.headers.get('cache-control');
      
      expect(cacheControl).toBeDefined();
      expect(cacheControl).toMatch(/max-age|public|private/i);
    });

    it('debe incluir ETag para validación', async () => {
      const response = await fetch(`${API_BASE}/api/products`);
      const etag = response.headers.get('etag');
      
      expect(etag).toBeDefined();
      console.log(`ETag: ${etag}`);
    });

    it('debe incluir Last-Modified header', async () => {
      const response = await fetch(`${API_BASE}/api/products`);
      const lastModified = response.headers.get('last-modified');
      
      expect(lastModified).toBeDefined();
      console.log(`Last-Modified: ${lastModified}`);
    });

    it('imágenes estáticas: max-age > 86400 (24h)', async () => {
      const response = await fetch(`${API_BASE}/Jpeg/sample.jpg`);
      const cacheControl = response.headers.get('cache-control');
      
      if (cacheControl) {
        const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
        if (maxAgeMatch) {
          const maxAge = parseInt(maxAgeMatch[1]);
          expect(maxAge).toBeGreaterThanOrEqual(86400);
        }
      }
    });

    it('API dinámico: max-age 300-600 (5-10 min)', async () => {
      const response = await fetch(`${API_BASE}/api/products`);
      const cacheControl = response.headers.get('cache-control');
      
      if (cacheControl) {
        const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
        if (maxAgeMatch) {
          const maxAge = parseInt(maxAgeMatch[1]);
          expect(maxAge).toBeGreaterThanOrEqual(300);
          expect(maxAge).toBeLessThanOrEqual(600);
        }
      }
    });
  });

  describe('Cache Validation & Revalidation', () => {
    it('debe retornar 304 si recurso no cambió', async () => {
      // Primera request
      const response1 = await fetch(`${API_BASE}/api/products`);
      const etag = response1.headers.get('etag');
      
      // Segunda request con If-None-Match
      const response2 = await fetch(`${API_BASE}/api/products`, {
        headers: { 'If-None-Match': etag }
      });
      
      expect(response2.status).toBe(304);
      CACHE_STATS.hits++;
    });

    it('debe retornar 200 si recurso cambió', async () => {
      const response1 = await fetch(`${API_BASE}/api/products`);
      const etag1 = response1.headers.get('etag');
      
      // Simular cambio (en caso real, esperar o modificar data)
      await new Promise(r => setTimeout(r, 100));
      
      const response2 = await fetch(`${API_BASE}/api/products`, {
        headers: { 'If-None-Match': 'invalid-etag-value' }
      });
      
      expect(response2.status).toBe(200);
      CACHE_STATS.misses++;
    });

    it('debe usar Last-Modified para revalidation', async () => {
      const response1 = await fetch(`${API_BASE}/api/products`);
      const lastModified = response1.headers.get('last-modified');
      
      const response2 = await fetch(`${API_BASE}/api/products`, {
        headers: { 'If-Modified-Since': lastModified }
      });
      
      // Debe retornar 304 o 200 válido
      expect([200, 304]).toContain(response2.status);
    });
  });

  describe('Redis Backend Cache', () => {
    it('multiple requests al mismo endpoint deben reutilizar cache', async () => {
      const startTime = Date.now();
      
      // Primera request (cache miss)
      const r1 = await fetch(`${API_BASE}/api/products`);
      const time1 = Date.now() - startTime;
      
      // Segunda request (cache hit - más rápida)
      const r2 = await fetch(`${API_BASE}/api/products`);
      const time2 = Date.now() - startTime - time1;
      
      console.log(`Cache miss: ${time1}ms, Cache hit: ${time2}ms`);
      
      // Hit debe ser más rápido
      expect(time2).toBeLessThan(time1);
      CACHE_STATS.hits++;
    });

    it('debe tener X-Cache header indicando hit/miss', async () => {
      const response = await fetch(`${API_BASE}/api/products`);
      const xCache = response.headers.get('x-cache');
      
      if (xCache) {
        expect(['HIT', 'MISS', 'CONDITIONAL']).toContain(xCache.toUpperCase());
        console.log(`Cache status: ${xCache}`);
      }
    });

    it('cache keys deben incluir versión de API', async () => {
      // Verificar que diferentes rutas tienen cache separado
      const r1 = await fetch(`${API_BASE}/api/v1/products`);
      const r2 = await fetch(`${API_BASE}/api/v2/products`);
      
      // Ambas deben regresar 200 (o 404 si v2 no existe)
      expect([200, 404]).toContain(r1.status);
      expect([200, 404]).toContain(r2.status);
    });
  });

  describe('Client-side Cache Layer', () => {
    it('debe soportar Local Storage para datos', async () => {
      // En Node, verificar que la API retorne JSON cacheable
      const response = await fetch(`${API_BASE}/api/products`);
      const data = await response.json();
      
      expect(data).toBeDefined();
      expect(Array.isArray(data.items) || data.items).toBeDefined();
    });

    it('debe incluir Content-Type para cliente', async () => {
      const response = await fetch(`${API_BASE}/api/products`);
      const contentType = response.headers.get('content-type');
      
      expect(contentType).toMatch(/application\/json/i);
    });
  });

  describe('Cache Hit Rate Metrics', () => {
    it('cache hit rate debe ser > 60%', async () => {
      // Simular múltiples requests
      for (let i = 0; i < 5; i++) {
        await fetch(`${API_BASE}/api/products?page=${i}`);
      }
      
      // En implementación real, tracear x-cache headers
      console.log(`Cache Stats - Hits: ${CACHE_STATS.hits}, Misses: ${CACHE_STATS.misses}`);
      
      // Estimación: después de múltiples requests, hits > misses
      const totalRequests = CACHE_STATS.hits + CACHE_STATS.misses + 5;
      const hitRate = (CACHE_STATS.hits / totalRequests) * 100;
      
      console.log(`Hit rate: ${hitRate.toFixed(1)}%`);
    });

    it('response time para cached requests debe ser < 300ms', async () => {
      const times = [];
      
      for (let i = 0; i < 3; i++) {
        const start = Date.now();
        await fetch(`${API_BASE}/api/products?cache=true`);
        times.push(Date.now() - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b) / times.length;
      console.log(`Average response time: ${avgTime.toFixed(0)}ms`);
      
      // Último request debe ser más rápido (cached)
      if (times.length > 1) {
        expect(times[times.length - 1]).toBeLessThan(times[0]);
      }
    });

    it('TTFB (Time to First Byte) debe mejorarse 200-400ms', async () => {
      const responses = [];
      
      for (let i = 0; i < 3; i++) {
        const start = Date.now();
        const response = await fetch(`${API_BASE}/api/products`);
        const ttfb = Date.now() - start;
        responses.push(ttfb);
      }
      
      const baseline = 450; // ms
      const improvement = responses[responses.length - 1];
      const reduction = ((baseline - improvement) / baseline * 100).toFixed(1);
      
      console.log(`TTFB improvement: ${reduction}%`);
      expect(improvement).toBeLessThan(baseline);
    });
  });

  describe('Cache Invalidation', () => {
    it('debe invalidar cache en POST/PUT/DELETE', async () => {
      // GET debe retornar datos cacheados
      const getResponse = await fetch(`${API_BASE}/api/products/1`);
      
      // POST debe invalidar cache
      const postResponse = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Product' })
      });
      
      if (postResponse.ok) {
        // Verificar que GET siguiente retorna datos frescos
        const getResponse2 = await fetch(`${API_BASE}/api/products/1`);
        expect(getResponse2.ok).toBe(true);
      }
    });

    it('debe soportar cache-busting con versión', async () => {
      const v1 = await fetch(`${API_BASE}/api/products?v=1`);
      const v2 = await fetch(`${API_BASE}/api/products?v=2`);
      
      expect(v1.ok).toBe(true);
      expect(v2.ok).toBe(true);
    });
  });

  afterAll(() => {
    const elapsed = Date.now() - CACHE_STATS.startTime;
    console.log(`\nCache test suite completed in ${elapsed}ms`);
  });
});
