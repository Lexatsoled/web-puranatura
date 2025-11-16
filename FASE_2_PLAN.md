# 🚀 FASE 2 - Plan de Rendimiento & UX

**Duración estimada**: 1-2 semanas  
**Prioridad**: 🔴 **ALTA** (impacta experiencia de usuario)  
**Prerequisito**: Fase 1 completada ✅

---

## Objetivos Fase 2

1. **Mejorar Core Web Vitals** (LCP, FID/INP, CLS)
2. **Optimizar bundle size** y tiempo de carga
3. **Implementar estrategias de caché** (HTTP + Redis)
4. **Eliminar N+1 queries** en backend
5. **Mejorar experiencia de error** del usuario

---

## Tareas Detalladas

### TAREA 2.1: Optimización de Imágenes (PERF-IMG-001)

**Estado**: ✅ Parcialmente completo (imágenes ya en `/Jpeg/`)

**Lo que falta**:
- [ ] Implementar `<picture>` element para AVIF/WebP/JPG fallback
- [ ] Lazy loading en componentes que no son críticos
- [ ] Responsive images con srcset

**Archivo clave**: `src/components/ImageZoom.tsx`

**Cambio propuesto**:
```typescript
// ANTES:
<img
  ref={imageRef}
  src={cleanSrc}
  srcSet={cleanSrcSet}
  sizes={sizes}
  alt={alt}
  loading="lazy"
/>

// DESPUÉS (picture element):
<picture>
  <source srcSet="/optimized/image.avif" type="image/avif" />
  <source srcSet="/optimized/image.webp" type="image/webp" />
  <img
    ref={imageRef}
    src={cleanSrc} {/* JPG fallback */}
    srcSet={cleanSrcSet}
    sizes={sizes}
    alt={alt}
    loading="lazy"
    decoding="async"
  />
</picture>
```

**Métrica de éxito**: 
- LCP ↓ 30-50% (esperado: < 2.5s)
- CLS < 0.1

**Pruebas**: Lighthouse audit en Desktop + Mobile

---

### TAREA 2.2: Análisis y Reducción de Bundle Size (PERF-BUNDLE-001)

**Objetivo**: Reducir JS bundle en 20-30%

**Pasos**:
1. Generar análisis con `npm run analyze` (si existe)
2. Identificar librerías duplicadas y no utilizadas
3. Implementar code splitting por rutas
4. Tree-shaking de dependencias

**Archivos a revisar**:
- `vite.config.ts` - Verificar optimizaciones de build
- `package.json` - Revisar dependencias no usadas
- `src/main.tsx` - Lazy loading de rutas

**Cambio ejemplo** (code splitting):
```typescript
// ANTES:
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';

// DESPUÉS (lazy loading):
import { lazy, Suspense } from 'react';
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));

// En router:
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/producto/:id" element={<ProductPage />} />
  </Routes>
</Suspense>
```

**Métrica de éxito**:
- Bundle size ↓ 20-30%
- Initial load time ↓ 15-25%

---

### TAREA 2.3: Estrategias de Caché HTTP + Redis (PERF-CACHE-001)

**Ubicación Backend**: `backend/src/app.ts`

**Implementación HTTP Headers**:
```typescript
// En cada ruta:
reply.header('Cache-Control', 'public, max-age=3600'); // 1 hora
reply.header('ETag', 'calculateETag(data)'); // Para validación
reply.header('Vary', 'Accept-Encoding'); // Para compresión
```

**Ejemplo: API de productos**:
```typescript
// GET /api/v1/products - Cacheable
reply.header('Cache-Control', 'public, max-age=3600');

// GET /api/v1/products/search - Sensible, cacheable con precaución
reply.header('Cache-Control', 'private, max-age=300'); // 5 min

// POST /api/v1/orders - No cacheable
reply.header('Cache-Control', 'no-cache, no-store, must-revalidate');
```

**Redis caching** (ya implementado, optimizar):
```typescript
// backend/src/services/productService.ts
const cacheKey = `products:${category}:${page}`;
let products = await redis.get(cacheKey);

if (!products) {
  products = await db.query(...);
  await redis.setex(cacheKey, 3600, JSON.stringify(products)); // 1 hora
}
```

**Métrica de éxito**:
- TTFB ↓ 200-400ms
- Repeat visitor load time ↓ 50-70%

---

### TAREA 2.4: Eliminar N+1 Queries (PERF-N+1-001)

**Ubicación**: `backend/src/services/productService.ts`

**Problema detectado**: 
```typescript
// ❌ N+1: 1 query por producto para obtener componentes
const products = await db.select().from(products).all();
products.forEach(p => {
  p.components = await db.select().from(components).where(...).all();
});
```

**Solución - Usar JOIN**:
```typescript
// ✅ Solución: 1 query con JOIN
import { eq, sql } from 'drizzle-orm';

const products = await db
  .select({
    ...getTableColumns(products),
    components: sql`json_group_array(json_object('name', ${components.name}))`.as('components')
  })
  .from(products)
  .leftJoin(components, eq(products.id, components.product_id))
  .groupBy(products.id)
  .all();
```

**Prueba de verificación**:
```typescript
// Test: Verificar número de queries
const queryCount = await trackQueries(() => productService.getAll());
assert(queryCount === 1, 'Should have only 1 query');
```

**Métrica de éxito**:
- Queries ↓ 50-80%
- API response time ↓ 300-500ms

---

### TAREA 2.5: Manejo Mejorado de Errores (UX-ERROR-001)

**Objetivo**: Mejor feedback al usuario en casos de error

**Ubicación**: `src/components/ErrorBoundary.tsx`

**Cambios propuestos**:
```typescript
// ANTES: Solo mensaje genérico
export const ErrorBoundary: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [error, setError] = useState<Error | null>(null);
  
  if (error) {
    return <div>Algo salió mal</div>;
  }
  
  return <>{children}</>;
};

// DESPUÉS: Errores contextuales con retry
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({children}) => {
  const [error, setError] = useState<ErrorWithContext | null>(null);
  
  if (error) {
    return (
      <ErrorCard
        title={error.userMessage}
        description={error.suggestions}
        action={
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        }
      />
    );
  }
  
  return <>{children}</>;
};
```

**Tipos de error a manejar**:
- 🔴 Network errors → "No hay conexión. Verifica tu red."
- 🟠 4xx Client errors → "Solicitud inválida"
- 🟡 5xx Server errors → "Error del servidor. Reintentando..."
- 🟢 Timeouts → "La solicitud tardó demasiado"

**Métrica de éxito**:
- User satisfaction ↑ 20%
- Support tickets por errores ↓ 30%

---

## Matriz de Tareas Fase 2

| ID | Tarea | Prioridad | Esfuerzo | Impacto | Owner | Status |
|-------|-------|-----------|----------|---------|--------|--------|
| 2.1 | Optimizar imágenes | 🔴 Alta | 🟡 Medio | 🔴 Alto | Frontend | ⏳ |
| 2.2 | Reducir bundle | 🔴 Alta | 🔴 Alto | 🟡 Medio | Frontend | ⏳ |
| 2.3 | Estrategias caché | 🔴 Alta | 🟡 Medio | 🔴 Alto | DevOps | ⏳ |
| 2.4 | Eliminar N+1 | 🔴 Alta | 🟡 Medio | 🟡 Medio | Backend | ⏳ |
| 2.5 | Errores UX | 🟡 Media | 🟢 Bajo | 🟡 Medio | Frontend | ⏳ |

---

## Métricas Actuales (Baseline)

**Antes de Fase 2**:
```
LCP: ~3.5s (Target: < 2.5s)
FID: ~120ms (Target: < 100ms)
CLS: ~0.15 (Target: < 0.1)
Bundle size: ~450KB (Target: < 350KB)
API P95: ~450ms (Target: < 300ms)
```

**Targets Fase 2**:
```
LCP: < 2.5s
FID: < 100ms
CLS: < 0.1
Bundle size: < 350KB
API P95: < 300ms
Error rate: < 0.5%
```

---

## Testing Plan Fase 2

### Unit Tests
```bash
npm run test:unit -- src/components/ImageZoom.tsx
npm run test:unit -- src/services/productService.ts
```

### Performance Tests
```bash
npm run test:performance
# O manual con Lighthouse
lighthouse http://localhost:5173
```

### E2E Tests
```bash
npm run test:e2e
# Verificar que lazy loading funciona
# Verificar que caché está activo
# Verificar errores se muestran correctamente
```

---

## Rollback Plan (si algo sale mal)

**Paso 1**: Revert commit anterior
```bash
git revert <commit-id>
```

**Paso 2**: Validar que servicios están UP
```bash
curl http://localhost:3001/health
curl http://localhost:5173
```

**Paso 3**: Notificar al equipo + investigar root cause

---

## Aprobación

- [ ] Tech Lead revisó plan
- [ ] QA aprobó scope
- [ ] Producto acepta timeline

**Inicio estimado**: Próxima semana  
**Cierre estimado**: +2 semanas

---

## Referencias

- [Google Web Vitals](https://web.dev/vitals/)
- [Bundle Analysis](https://developer.chrome.com/docs/web-platform/app-size)
- [HTTP Caching Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Drizzle ORM Queries](https://orm.drizzle.team/)
