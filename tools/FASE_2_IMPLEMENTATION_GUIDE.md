# 🚀 FASE 2: GUÍA DE IMPLEMENTACIÓN PASO A PASO

**Timeline:** 1-2 semanas | **Status:** Listo para comenzar

---

## 📋 TABLA DE CONTENIDOS

1. [Setup Inicial](#setup-inicial)
2. [PERF-IMG-001: Optimizar Imágenes](#perf-img-001-optimizar-imágenes)
3. [PERF-BUNDLE-001: Reducir Bundle Size](#perf-bundle-001-reducir-bundle-size)
4. [PERF-CACHE-001: Estrategias de Caché](#perf-cache-001-estrategias-de-caché)
5. [PERF-N+1-001: Eliminar N+1 Queries](#perf-n+1-001-eliminar-n+1-queries)
6. [UX-ERROR-001: Mejorar Manejo de Errores](#ux-error-001-mejorar-manejo-de-errores)
7. [Validación Final](#validación-final)

---

## SETUP INICIAL

### 1.1 Preparar Ambiente

```bash
# Ejecutar script de setup
.\tools\FASE_2_SETUP.ps1

# Resultado esperado:
# ✅ Dependencias verificadas
# ✅ Herramientas instaladas
# ✅ Directorios creados
# ✅ Métricas base capturadas
```

### 1.2 Crear Rama de Desarrollo

```bash
# Branch para Fase 2 (ya creado por SETUP.ps1)
git checkout fase-2

# Verificar
git branch -v  # Debe mostrar "* fase-2"
```

### 1.3 Verificar Línea Base

```bash
# Ver métricas capturadas
cat ./tools/metrics/baseline.json
```

**Expected Output:**
```json
{
  "bundleSize": 450.5,
  "metrics": {
    "lcp": "~3.5s",
    "api_p95": "~450ms"
  }
}
```

---

## PERF-IMG-001: OPTIMIZAR IMÁGENES

**Owner:** Frontend Lead  
**Effort:** 🟡 Medio  
**Impact:** 🔴 Alto  
**Target:** LCP ↓ 30-50%

### Paso 1: Analizar Imágenes Actuales

```bash
# Ubicación de imágenes
ls -lh public/Jpeg/ | head -20

# Tamaño total
du -sh public/Jpeg/
```

**Expected:** ~150MB de JPEG sin comprimir

### Paso 2: Implementar Picture Element

**Archivo:** `src/components/ProductImage.tsx`

```typescript
// ANTES (simple img)
<img src={imagePath} alt={name} />

// DESPUÉS (picture element con múltiples formatos)
<picture>
  <source srcSet={avifPath} type="image/avif" />
  <source srcSet={webpPath} type="image/webp" />
  <img 
    src={jpegPath}
    srcSet={`${jpegPath} 1x, ${jpegPath2x} 2x`}
    alt={name}
    loading="lazy"
    decoding="async"
    width={300}
    height={300}
  />
</picture>
```

### Paso 3: Generar Formatos Modernos

```bash
# Instalar herramientas (opcional si no están)
npm install -D sharp imagemin imagemin-avif imagemin-webp

# Script para convertir (crear: scripts/optimize-images.js)
node scripts/optimize-images.js

# Esperar a que procese 1,131 imágenes (~15-30 minutos)
```

**Script de conversión:**
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = './public/Jpeg';
const targetDir = './public/Jpeg/optimized';

fs.readdirSync(sourceDir)
  .filter(f => f.endsWith('.jpg'))
  .forEach(filename => {
    const source = path.join(sourceDir, filename);
    
    // AVIF
    sharp(source)
      .avif({ quality: 80 })
      .toFile(path.join(targetDir, filename.replace('.jpg', '.avif')));
    
    // WebP
    sharp(source)
      .webp({ quality: 80 })
      .toFile(path.join(targetDir, filename.replace('.jpg', '.webp')));
  });
```

### Paso 4: Actualizar ProductPage Component

**Archivo:** `src/pages/ProductPage.tsx`

```typescript
// Generar srcset dinámicamente
const generateSrcSet = (filename: string) => {
  const base = `/Jpeg/${filename}`;
  return {
    avif: base.replace('.jpg', '.avif'),
    webp: base.replace('.jpg', '.webp'),
    jpeg: base
  };
};
```

### Paso 5: Validar

```bash
# Ejecutar tests
npm run test -- tools/tests/perf-img.test.ts

# Resultado esperado:
# ✅ Picture element implementation
# ✅ AVIF/WebP generation
# ✅ 30% size reduction
```

### Paso 6: Medir Mejora

```bash
# Lighthouse en navegador
# Open DevTools → Lighthouse → Analyze page load
# Expected: LCP 3.5s → 2.4s (30% improvement)

# O usar CLI
npx lighthouse http://localhost:3000 --output json
```

---

## PERF-BUNDLE-001: REDUCIR BUNDLE SIZE

**Owner:** Frontend Lead  
**Effort:** 🔴 Alto  
**Impact:** 🟡 Medio  
**Target:** Bundle < 350KB (reducir 30%)

### Paso 1: Analizar Bundle Actual

```bash
# Ver desglose de bundle
npm run build

# Usar bundlesize CLI
npx bundlesize
```

**Expected:** ~450KB actual

### Paso 2: Habilitar Tree-Shaking

**Archivo:** `vite.config.ts`

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Habilitar tree-shaking
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    // Minificación agresiva
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        dead_code: true
      }
    }
  }
});
```

### Paso 3: Implementar Code Splitting

```typescript
// ANTES
import { ProductPage } from './pages/ProductPage';
import { HomePage } from './pages/HomePage';

// DESPUÉS (lazy load)
import { lazy, Suspense } from 'react';

const ProductPage = lazy(() => import('./pages/ProductPage'));
const HomePage = lazy(() => import('./pages/HomePage'));

<Suspense fallback={<Spinner />}>
  <ProductPage />
</Suspense>
```

### Paso 4: Remover Dependencias No Usadas

```bash
# Analizar imports
npm run analyze  # si está configurado

# Buscar imágenes inactivas
grep -r "import.*from.*unused" src/
```

**Ejemplos comunes a remover:**
- Librerías de logging
- Polyfills innecesarios
- Fuentes de Google no utilizadas

### Paso 5: Optimizar Vendor Bundle

```typescript
// Usar versiones más pequeñas
// ❌ axios (45KB)
// ✅ fetch nativo (0KB)

// ❌ lodash (71KB)
// ✅ usar métodos nativos

// ❌ moment.js (67KB)
// ✅ date-fns (13KB)
```

### Paso 6: Validar

```bash
npm run test -- tools/tests/perf-bundle.test.ts

# Resultado esperado:
# ✅ Main bundle < 350KB
# ✅ Vendor < 200KB
# ✅ 30% size reduction
```

---

## PERF-CACHE-001: ESTRATEGIAS DE CACHÉ

**Owner:** Backend Lead  
**Effort:** 🟡 Medio  
**Impact:** 🔴 Alto  
**Target:** TTFB ↓ 200-400ms, Hit Rate > 60%

### Paso 1: Configurar HTTP Cache Headers

**Archivo:** `backend/src/plugins/cacheHeaders.ts` (nuevo)

```typescript
import fp from 'fastify-plugin';

export default fp(async (app) => {
  app.addHook('onSend', async (request, reply) => {
    const isStatic = request.url.startsWith('/Jpeg');
    const isAPI = request.url.startsWith('/api');
    
    if (isStatic) {
      // Imágenes: cache 24 horas
      reply.header('Cache-Control', 'public, max-age=86400, immutable');
      reply.header('ETag', generateETag(request.url));
    } else if (isAPI) {
      // API: cache 5-10 minutos
      reply.header('Cache-Control', 'public, max-age=600');
      reply.header('ETag', generateETag(request.url));
    }
  });
});
```

### Paso 2: Integrar Redis

```bash
# Instalar Redis (si no está)
npm install @fastify/redis

# En producción, usar servicio Redis
```

**Archivo:** `backend/src/plugins/redisCache.ts`

```typescript
import fp from 'fastify-plugin';
import Redis from '@fastify/redis';

export default fp(async (app) => {
  await app.register(Redis, {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  // Middleware para cachear GETs
  app.addHook('onRequest', async (request, reply) => {
    if (request.method === 'GET') {
      const cached = await app.redis.get(request.url);
      if (cached) {
        reply.header('X-Cache', 'HIT');
        return reply.send(JSON.parse(cached));
      }
    }
  });
  
  // Cachear response
  app.addHook('onSend', async (request, reply) => {
    if (request.method === 'GET' && reply.statusCode === 200) {
      const payload = reply.getPayload();
      await app.redis.setex(
        request.url,
        600,  // 10 minutos
        JSON.stringify(payload)
      );
      reply.header('X-Cache', 'MISS');
    }
  });
});
```

### Paso 3: Implementar ETag Validation

```typescript
const generateETag = (content: string) => {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(content).digest('hex');
};

// En response handler
reply.header('ETag', generateETag(responseBody));
```

### Paso 4: Client-side Cache

**Archivo:** `src/hooks/useCache.ts` (nuevo)

```typescript
export const useCache = () => {
  const set = (key: string, value: any, ttl: number = 600000) => {
    const item = {
      value,
      expires: Date.now() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  };
  
  const get = (key: string) => {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const { value, expires } = JSON.parse(item);
    if (Date.now() > expires) {
      localStorage.removeItem(key);
      return null;
    }
    return value;
  };
  
  return { set, get };
};
```

### Paso 5: Validar

```bash
npm run test -- tools/tests/perf-cache.test.ts

# Resultado esperado:
# ✅ HTTP cache headers present
# ✅ ETag validation working
# ✅ Cache hit rate > 60%
# ✅ TTFB < 300ms
```

---

## PERF-N+1-001: ELIMINAR N+1 QUERIES

**Owner:** Backend Lead  
**Effort:** 🟡 Medio  
**Impact:** 🟡 Medio  
**Target:** API P95 < 300ms, 80% reducción de queries

### Paso 1: Identificar N+1 Queries

```bash
# Activar query logging
# En backend/src/index.ts, agregar:

if (config.NODE_ENV === 'development') {
  // Log todas las queries
  app.addHook('onRequest', async (request) => {
    request.startTime = Date.now();
  });
}
```

### Paso 2: Refactorizar /api/products

**Archivo:** `backend/src/routes/v1/products.ts`

```typescript
// ANTES (N+1):
const products = await db.select().from(Product);
const withRelations = await Promise.all(
  products.map(async (p) => ({
    ...p,
    category: await db.select().from(Category).where({ id: p.categoryId }),
    images: await db.select().from(Image).where({ productId: p.id })
  }))
);

// DESPUÉS (JOIN):
const products = await db
  .select()
  .from(Product)
  .leftJoin(Category, eq(Product.categoryId, Category.id))
  .leftJoin(Image, eq(Product.id, Image.productId));
```

### Paso 3: Usar Drizzle ORM JOINs

```typescript
import { db } from '../db/index.js';
import { Product, Category, Image } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

// Query eficiente con JOINs
const products = await db
  .select({
    product: Product,
    category: Category,
    imagesCount: sql`COUNT(${Image.id})`
  })
  .from(Product)
  .leftJoin(Category, eq(Product.categoryId, Category.id))
  .leftJoin(Image, eq(Product.id, Image.productId))
  .groupBy(Product.id, Category.id);
```

### Paso 4: Agregar Query Profiling

```typescript
// Middleware para loguear queries
app.addHook('onSend', async (request, reply) => {
  const queryCount = request.queryCount || 1;
  const queryTime = Date.now() - request.startTime;
  
  reply.header('X-Query-Count', queryCount.toString());
  reply.header('X-Query-Time', queryTime.toString());
  
  if (config.NODE_ENV === 'development') {
    console.log(`[QUERY PROFILE] ${request.url}: ${queryCount} queries, ${queryTime}ms`);
  }
});
```

### Paso 5: Validar

```bash
npm run test -- tools/tests/perf-n+1.test.ts

# Resultado esperado:
# ✅ Single query for product list
# ✅ X-Query-Count header: 1-2 (vs 11+)
# ✅ API P95: 300ms (vs 450ms)
```

---

## UX-ERROR-001: MEJORAR MANEJO DE ERRORES

**Owner:** Frontend Lead  
**Effort:** 🟢 Bajo  
**Impact:** 🟡 Medio  
**Target:** Error Recovery > 90%, Support ↓ 30%

### Paso 1: Crear Custom Error Hook

**Archivo:** `src/hooks/useErrorBoundary.ts` (nuevo)

```typescript
export const useErrorBoundary = () => {
  const [error, setError] = useState<ApiError | null>(null);
  const [retries, setRetries] = useState(0);
  
  const withErrorHandling = async <T>(
    fn: () => Promise<T>,
    maxRetries = 3
  ): Promise<T | null> => {
    try {
      return await fn();
    } catch (err) {
      const isRetryable = err.status >= 500 || err.code === 'ECONNREFUSED';
      
      if (isRetryable && retries < maxRetries) {
        const delay = Math.pow(2, retries) * 100;
        await new Promise(r => setTimeout(r, delay));
        setRetries(r => r + 1);
        return withErrorHandling(fn, maxRetries);
      }
      
      setError({
        message: getErrorMessage(err),
        code: err.code,
        retryable: isRetryable
      });
      
      return null;
    }
  };
  
  return { error, withErrorHandling, retry: () => setRetries(0) };
};
```

### Paso 2: Crear Error Boundary Component

**Archivo:** `src/components/ErrorBoundary.tsx` (nuevo)

```typescript
export const ErrorBoundary: React.FC = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Algo salió mal</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Recargar página
        </button>
        <button onClick={() => setError(null)}>
          Intentar de nuevo
        </button>
      </div>
    );
  }
  
  return <>{children}</>;
};
```

### Paso 3: Implementar Auto-Retry

```typescript
// En ProductPage.tsx
const [products, setProducts] = useState([]);
const { withErrorHandling, error } = useErrorBoundary();

useEffect(() => {
  withErrorHandling(async () => {
    const data = await fetchProducts();
    setProducts(data);
  });
}, []);
```

### Paso 4: Mejorar API Error Responses

**Archivo:** `backend/src/plugins/errorHandler.ts`

```typescript
app.setErrorHandler((error, request, reply) => {
  const isProduction = config.NODE_ENV === 'production';
  
  reply.status(error.statusCode || 500).send({
    error: {
      message: getErrorMessage(error),
      code: getErrorCode(error),
      requestId: request.id,
      // Solo en desarrollo
      ...(isProduction ? {} : { stack: error.stack })
    }
  });
});

const getErrorMessage = (error: any): string => {
  if (error.message.includes('Not Found')) return 'Producto no encontrado';
  if (error.message.includes('validation')) return 'Datos inválidos';
  return 'Error procesando tu solicitud';
};
```

### Paso 5: Agregar Retry UI

```tsx
{error && (
  <div className="alert alert-error">
    <p>{error.message}</p>
    <button onClick={() => retry()}>Reintentar</button>
  </div>
)}
```

### Paso 6: Validar

```bash
npm run test -- tools/tests/ux-error.test.ts

# Resultado esperado:
# ✅ Contextual error messages
# ✅ Auto-retry mechanism
# ✅ Error recovery > 90%
```

---

## VALIDACIÓN FINAL

### Ejecutar Suite Completa de Tests

```bash
# Todos los tests
npm run test:fase2

# Validar cada tarea
.\tools\FASE_2_VALIDATE.ps1 -CheckAll

# Resultado esperado:
# ✅ PERF-IMG-001: PASSED (Score 100%)
# ✅ PERF-BUNDLE-001: PASSED (Score 95%)
# ✅ PERF-CACHE-001: PASSED (Score 90%)
# ✅ PERF-N+1-001: PASSED (Score 95%)
# ✅ UX-ERROR-001: PASSED (Score 100%)
```

### Comparar vs Baseline

```bash
# Abrir dashboard
.\tools\FASE_2_MONITOR.ps1

# Verificar métricas (esperado vs actual):
# LCP: 3.5s → 2.3s ✅ (35% mejora)
# Bundle: 450KB → 320KB ✅ (30% reducción)
# API P95: 450ms → 250ms ✅ (44% mejora)
# Cache Hit: ~20% → 65% ✅ (225% mejora)
```

### Crear PR para Review

```bash
# Commit cambios
git add -A
git commit -m "feat: FASE 2 optimizaciones de rendimiento (IMG, Bundle, Cache, N+1, UX)"

# Push branch
git push origin fase-2

# Crear Pull Request en GitHub/GitLab
# Descripción: incluir resumen de métricas mejoridas
```

### Merge a Main

```bash
git checkout main
git merge fase-2 --no-ff
git push origin main
```

---

## 📞 SOPORTE & TROUBLESHOOTING

### Si tests fallan:

```bash
# 1. Limpiar node_modules y reinstalar
rm -r node_modules
npm install

# 2. Ejecutar script de rollback
.\tools\FASE_2_ROLLBACK.ps1

# 3. Revisar logs
cat ./tools/logs/setup-status.json
```

### Contactos por Task:

- **PERF-IMG-001** → Frontend Lead (optimización de imágenes)
- **PERF-BUNDLE-001** → Frontend Lead (build optimization)
- **PERF-CACHE-001** → Backend Lead + DevOps (infraestructura)
- **PERF-N+1-001** → Backend Lead (queries)
- **UX-ERROR-001** → Frontend Lead (componentes)

---

## 🎉 ¡LISTO!

Cuando todas las tareas estén validadas:

1. ✅ Fase 2 completada
2. 📊 Métricas mejoradas 30-50%
3. 🚀 Deployment a producción
4. 📈 Monitoreo continuo en producción
5. ⏳ Comenzar Fase 3 (Accesibilidad)

