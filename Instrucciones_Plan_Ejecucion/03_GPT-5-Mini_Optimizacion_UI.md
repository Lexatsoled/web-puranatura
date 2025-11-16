# GPT-5-Mini – Optimización de UI, Encoding y Offline

## Alcance
1. Reparar el mapa de mojibake y limpiar cadenas corruptas en stores/UI.
2. Actualizar el Service Worker para cubrir `/api/v1/**` y mejorar estrategias de caché.
3. Migrar los componentes de imágenes (CartPage, CheckoutPage, BlogPage, ServicePage, SystemCard, etc.) a `OptimizedImage`/`generateSrcSet` y asegurar rutas `/public/optimized`.

## Dependencias
- Requiere los cambios de seguridad aprobados (para evitar conflictos en `service-worker.ts`).
- Necesita que `scripts/optimizeImages.ts` esté disponible para generar assets (no lo modifiques, sólo ejecútalo si faltan variantes).

## Detalle de tareas
### 1. Encoding
- Editar `src/utils/encoding.ts` para que `MOJIBAKE_MAP` use caracteres reales (`á`, `ñ`, `¿`, etc.). Puedes almacenar el mapa en JSON o directamente en el archivo.
- Añadir pruebas en `src/utils/__tests__/encoding.test.ts` cubriendo `normalizeText`, `hasMojibake`, `sanitizeObject`.
- Ejecutar `npm run check:encoding` y limpiar strings corruptos en `src/store/checkoutStore.ts`, `src/pages/**/*.tsx`, `src/data/*.ts` (usa `scripts/clean_specific_files.cjs` si ayuda).

### 2. Service Worker
- En `src/service-worker.ts`, cambia todos los predicados a `/api/v1/products`, `/api/v1/orders`, etc. Añade `registerRoute` para `/api/v1/analytics/vitals` si hace falta caching (opcional, sólo si es GET).
- Asegura que `BackgroundSyncPlugin` se active cuando la red esté caída (puedes añadir `plugins: [bgSyncPlugin]` y un `maxRetentionTime` claro).
- Verifica que `precacheAndRoute` incluya `/offline.html`.

### 3. Imágenes
- Actualiza `CartPage.tsx`, `CheckoutPage.tsx`, `BlogPage.tsx`, `BlogPostPage.tsx`, `ServicePage.tsx`, `components/SystemCard.tsx` para usar el componente `OptimizedImage` en vez de `<picture>/<img>` manuales. Aprovecha `generateSrcSet`.
- Corrige `src/data/products.ts` para apuntar a `/optimized/*.webp`. Si no existen los archivos, documenta en PR que se deben generar con `npm run optimize-images`.

## Comandos a ejecutar
```bash
npm run check:encoding
npm run lint
npm run test:unit -- --runInBand # o npx vitest src/utils/encoding.test.ts
npm run build # asegura que Vite compila con SW actualizado
npm run test:e2e -- --grep "offline" # cuando exista el caso
```

## Criterios de éxito
- `git diff` sin caracteres extraños; `check:encoding` no reporta errores.
- Lighthouse mejora `total-byte-weight` (>30 % menos) y no hay warnings de `Failed parsing srcset`.
- Playwright offline test demuestra que `/tienda` funciona sin red.

## Verificación
- Adjunta logs de `npm run check:encoding` y `npm run build`.
- Incluye captura/texto de Lighthouse comparando peso de imágenes antes/después.
