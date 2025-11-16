# Plan de mejora por fases – Pureza-Naturalis-V3

Artefacto vivo que conecta los hallazgos de `findings.json` con acciones concretas. Cada tarea incluye objetivo, pasos, ejemplo de diff, pruebas, métricas, riesgos y plan de rollback.

## Fase 0 – Análisis inicial (completada)
- Inventario exhaustivo (`inventory.json`, 1 664 archivos útiles; excluidos artefactos generados).
- Top riesgos rápidos detectados: endpoint `/api/test/product/:id`, falta de autenticación en `/api/analytics/vitals`, normalizador de texto corrupto, checkout desconectado del backend y service worker apuntando a rutas erróneas.

## Fase 1 – Seguridad y estabilidad de datos (ETA 2025-11-18)

### Tarea S1 – Retirar/el restringir `/api/test/product/:id`
- **Hallazgo:** `SEC-DBG-001`
- **Objetivo:** Evitar la exposición directa de la base SQLite sin autenticación.
- **Pasos:**
  1. Eliminar `backend/src/routes/test.ts` o envolverlo con `if (config.NODE_ENV === 'development')` + `requireRole('admin')`.
  2. Actualizar `buildApp` para no registrar la ruta en producción.
  3. Añadir prueba e2e que confirme `404/403` en entorno default.
- **Diff sugerido:**
  ```diff
  // backend/src/routes/test.ts
-  export async function testRoutes(app: FastifyInstance) {
-    app.get('/test/product/:id', async (request, reply) => {
-      ...
-    });
-  }
+  export async function testRoutes(app: FastifyInstance) {
+    if (process.env.NODE_ENV !== 'development') {
+      return;
+    }
+    app.get('/test/product/:id', { preHandler: [requireRole('admin')] }, async (request, reply) => {
+      ...
+    });
+  }
  ```
- **Pruebas:** nueva suite `backend/src/routes/__tests__/test-route.spec.ts` (Fastify in-memory) + smoke Playwright hit `/api/test/product/1`.
- **Métrica de éxito:** 0 respuestas 200 en entornos no dev (monitorear logs).
- **Riesgos:** scripts que dependan del endpoint; anunciar deprecación.
- **Rollback:** revertir commit y reactivar la ruta temporalmente en `NODE_ENV=development`.

### Tarea S2 – Blindar `/api/analytics/vitals` y `/admin/analytics/vitals`
- **Hallazgo:** `SEC-ANA-002`
- **Objetivo:** Evitar fuga de PII y abusos DoS del buffer in-memory.
- **Pasos:**
  1. Añadir `preHandler: [requireRole('admin')]` y `createRateLimitConfig('admin')` al GET de admin.
  2. Limitar `vitalsStore` a 500 entradas y descartar payloads >10KB.
  3. Añadir sanitización básica (`z.object`) para `POST /analytics/vitals`.
- **Diff:**
  ```diff
  fastify.get('/admin/analytics/vitals', {
-  }, async () => {
+    preHandler: [requireRole('admin')],
+    config: { rateLimit: createRateLimitConfig('admin') },
+  }, async () => {
      const metrics = {
  ```
- **Pruebas:** unidad (`analyticsRoutes.spec.ts`) validando 403 para usuarios estándar y que el store se recorta a 500.
- **Métrica:** dashboard con autenticación + alerta si buffer >500.
- **Riesgos:** dashboards existentes deben enviar credenciales.
- **Rollback:** quitar preHandler y restaurar límite anterior.

### Tarea S3 – Normalizar utilidades de encoding y limpiar mojibake en UI
- **Hallazgo:** `I18N-MOJI-003`
- **Objetivo:** Que `normalizeText` convierta secuencias `Ã¡` → `á` en vez de caracteres corruptos.
- **Pasos:**
  1. Reescribir `MOJIBAKE_MAP` en `src/utils/encoding.ts` usando literales reales (`'á'`, `'¿'`, etc.).
  2. Añadir pruebas unitarias (`src/utils/__tests__/encoding.test.ts`) cubriendo `normalizeText`, `hasMojibake`, `sanitizeObject`.
  3. Ejecutar `node tools/check_encoding.cjs` y corregir cadenas en stores (`src/store/checkoutStore.ts`, mensajes `Dirección de envío`).
- **Diff (fragmento):**
  ```diff
-  '\u00C3\u00A1': 'ǭ',
+  '\u00C3\u00A1': 'á',
  ```
- **Pruebas:** `npx vitest src/utils/encoding.test.ts`.
- **Métrica:** 0 ocurrencias de `Ã`/`��` en `src/**/*.ts*` (script `tools/check_encoding`).
- **Riesgos:** buscar falsos positivos (palabras técnicas). Documentar excepciones en `.encodingignore`.
- **Rollback:** restaurar mapa anterior (no recomendado) o activar fallback `TextDecoder`.

### Tarea S4 – Corregir `/api/v1/products/system/:systemId`
- **Hallazgo:** `API-VAL-005`
- **Objetivo:** Permitir filtros por sistema sin validar un body inexistente.
- **Pasos:**
  1. Remover `validateSchema('product.create', 'body')` del preHandler.
  2. Añadir test `backend/src/routes/v1/__tests__/products-system.spec.ts` con filtros y paginación.
  3. Documentar el endpoint en `docs/api/products.md`.
- **Diff:**
  ```diff
-  preHandler: [validateSchema('product.create', 'body'), validateSchema('product.filters', 'query')],
+  preHandler: [validateSchema('product.filters', 'query')],
  ```
- **Pruebas:** Fastify inject GET `/api/v1/products/system/cardio?page=2&limit=6`.
- **Métrica:** 200 OK con lista paginada desde pruebas Playwright en `SistemasSinergicosPage`.
- **Riesgos:** ningún efecto colateral esperado.
- **Rollback:** reinsertar validación anterior (sólo si se detectan regresiones).

## Fase 2 – Coordinación FE/BE y performance (ETA 2025-11-22)

### Tarea P1 – Conectar checkoutStore con `/api/v1/orders`
- **Hallazgo:** `FUNC-CHECKOUT-004`
- **Objetivo:** Persistir pedidos reales y disparar background sync.
- **Pasos:**
  1. Sustituir el `setTimeout` de `processOrder` por `await OrderService.placeOrder(cart)`.
  2. Capturar errores de API y mostrar notificaciones (useErrorNotification).
  3. Ajustar service worker para reintentos si offline (ver P2).
- **Diff (resumen):**
  ```diff
-      await new Promise((resolve) => setTimeout(resolve, 2000));
-      const orderId = `ORD-${Date.now()}-${Math.random()...}`;
+      const response = await OrderService.placeOrder(mapCartToPayload(cart));
+      const orderId = response.orderId;
  ```
- **Pruebas:** mock de `OrderService` en `src/pages/__tests__/CheckoutPage.test.tsx` + integración Playwright checkout feliz.
- **Métrica:** tasa de pedidos fallidos <1 % (monitorizar logs + analytics).
- **Riesgos:** requiere backend levantado para dev; proveer fallback (modo demo).
- **Rollback:** reactivar simulación guardando bandera `USE_FAKE_CHECKOUT` sólo en sandbox.

### Tarea P2 – Ajustar service worker a rutas versionadas
- **Hallazgo:** `PERF-SW-006`
- **Objetivo:** Que precache y background sync funcionen con `/api/v1/**`.
- **Pasos:**
  1. Cambiar selectores `url.pathname.startsWith('/api/products')` → `/api/v1/products`.
  2. Idem para `/api/orders` → `/api/v1/orders` y añadir `ignoreURLParametersMatching` para claves volátiles.
  3. Regenerar manifest con `vite build` y validar en Lighthouse offline.
- **Diff:**
  ```diff
-({ url }) => url.pathname.startsWith('/api/products')
+({ url }) => url.pathname.startsWith('/api/v1/products')
  ```
- **Pruebas:** `npm run test:e2e` + `workbox-window` integration smoke (modo offline).
- **Métrica:** LCP mejora ≥20 % (ver dashboard), auditoría PWA sin warnings.
- **Riesgos:** usuarios con SW antiguo deben recibir mensaje `SKIP_WAITING`.
- **Rollback:** publicar nueva versión del SW revertida.

### Estado actual - P2 (actualizado)

- **Acciones aplicadas:**
  - Se añadió un runtime genérico que apunta a `/api/v1/**` con estrategia `NetworkFirst` (cache `api-runtime`, timeout 10s, retención 6h).
  - `BackgroundSyncPlugin('orders-queue', ...)` está configurado y sigue asociado a `POST /api/v1/orders` con `maxRetentionTime` = 1440 (24h).
  - `precacheAndRoute` ya incluye `ignoreURLParametersMatching` con parámetros comunes (`utm_*`, `fbclid`, `gclid`, `v`, `cacheBust`).

- **Pruebas a ejecutar ahora (evidencias):**
  - Generar build: 
    ```powershell
    npm run build
    ```
  - Ejecutar check de encoding y limpieza si es necesario:
    ```powershell
    npm run check:encoding > reports/encoding-check.log 2>&1
    npm run clean:mojibake
    ```
  - Ejecutar test unit específico para `normalizeSrcSet`:
    ```powershell
    npx vitest run src/utils/__tests__/normalizeSrcSet.spec.ts --reporter=dot > reports/normalize-srcset.log 2>&1
    ```
  - Ejecutar Lighthouse PWA / offline smoke (local preview):
    ```powershell
    npm run build; npm run preview & timeout 5s; npx lighthouse http://localhost:3000 --only-categories=performance,pwa --output=json --output-path=reports/lighthouse-pwa.json
    ```

- **Dónde guardar evidencias:**
  - `reports/encoding-check.log`
  - `reports/normalize-srcset.log`
  - `reports/lighthouse-pwa.json`
  - Playwright E2E traces en `test-results/` (si se ejecutan pruebas cambiadas).

- **Estado:** cambios aplicados en el SW; pendientes ejecutar los comandos anteriores y adjuntar logs.

### Tarea P3 – Centralizar generación de `srcset`
- **Hallazgo:** `PERF-IMG-007`
- **Objetivo:** Reducir payload de imágenes y eliminar warnings de `Failed parsing srcset`.
- **Pasos:**
  1. Reemplazar `string.replace(/
.(jpg|jpeg|png)$/i, '_320.webp')` en `CartPage`, `CheckoutPage`, `BlogPage`, `ServicePage`, `SystemCard` por `generateSrcSet(product.images[0]?.full)` + `<OptimizedImage>`.
  2. Extender `generateSrcSet` para soportar `.webp`/`.avif` y prefijos `/optimized/`.
  3. Actualizar dataset (`src/data/products.ts` o API) para usar rutas en `/optimized/`.
- **Diff:**
  ```diff
-<source srcSet={`${img.full.replace(... '_320.webp')} ...`} />
+<OptimizedImage src={primary.full} alt={product.name} sizes="96px" />
  ```
- **Pruebas:** unit `generateSrcSet.test.ts`, Lighthouse run (`npm run analyze`) comparando peso de imágenes.
- **Métrica:** Total Byte Weight < 1 MB en ProductPage (`lighthouse` report).
- **Riesgos:** rutas inexistentes (asegurar script `optimizeImages` genera variantes).
- **Rollback:** volver a `<img>` tradicional mientras se corrigen rutas.

## Fase 3 – Accesibilidad, SEO y contenido (ETA 2025-11-27)

### Tarea A1 – Sitemap dinámico desde la base de datos
- **Hallazgo:** `SEO-SITEMAP-008`
- **Objetivo:** Indexar productos reales (`/tienda/:slug`) en motores de búsqueda.
- **Pasos:**
  1. Reemplazar `const products: Product[] = []` por query Drizzle (`db.select({ id: products.id, updatedAt: products.updatedAt })`).
  2. Cachear XML 24 h en Redis (`cacheService.wrap`).
  3. Añadir prueba que valide `<loc>` para 3 productos y `lastmod` ISO.
- **Métrica:** Google Search Console detecta nuevas URL en <48 h.

### Tarea A2 – Limpieza de mojibake en textos UI + dataset
- **Objetivo complementario:** Tras S3, ejecutar `scripts/clean_specific_files.cjs` sobre `src/pages`, `src/store`, `.env` y los seeds del backend.
- **Pruebas:** `npm run check:encoding` + revisión manual en Checkout/Orders.
- **Métrica:** 0 incidencias en QA, feedback positivo en A11y.

## Fase 4 – Observabilidad y prevención (ETA 2025-12-02)

### Tarea O1 – Suite de regresión automatizada
- **Objetivo:** Formalizar `regression-suite.md` (unit + e2e + seguridad).
- **Pasos:**
  1. Añadir workflow `ci.yml` con jobs `lint`, `vitest`, `playwright`, `k6 smoke`, `lighthouse-ci`.
  2. Publicar reportes en `reports/` y subir a artefactos de GitHub.
  3. Integrar cobertura mínima (80 %).

### Tarea O2 – Tablero de métricas y alertas
- **Objetivo:** Automatizar `metrics-dashboard.md`.
- **Pasos:**
  1. Script `scripts/collect_metrics.ts` que ejecute `lighthouse` + `k6` y actualice JSON histórico.
  2. Alertas (Slack/Webhook) cuando LCP > target o API P95 >300 ms.
  3. Documentar cómo consumir el dashboard (Grafana o Markdown).

---
**Notas:**
- Cada fase debe cerrar con PR revisada + actualización de `findings.json` (estatus/resueltos).
- Mantener un branch por tarea crítica para facilitar rollback.
