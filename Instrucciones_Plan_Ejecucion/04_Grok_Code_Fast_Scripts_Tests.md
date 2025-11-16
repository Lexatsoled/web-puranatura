# Grok Code Fast 1 – Scripts, SEO y Automatización

## Alcance
1. Convertir `backend/src/routes/sitemap.ts` en un generador dinámico basado en la base de datos.
2. Crear/actualizar scripts de métricas (`scripts/collect_metrics.ts` o `.ps1`) y pruebas automáticas (k6, Playwright, Lighthouse batch).
3. Integrar los nuevos comandos en `package.json` y en la guía de `regression-suite.md`.

## Dependencias
- Debes tener acceso a SQLite (`backend/database.sqlite`). Usa Drizzle o `better-sqlite3` para consultas read-only.
- Para k6 y Lighthouse se requiere tenerlos instalados o usar versiones npm (`lighthouse`, `k6`).

## Pasos detallados
### 1. Sitemap dinámico
- En `backend/src/routes/sitemap.ts`, reemplaza el array vacío por una consulta Drizzle: selecciona `products.id`, `products.updatedAt`.
- Construye URLs tipo `/tienda/${slug || id}` (usa `product.slug` si existe; si no, `id`).
- Cachea el XML 24 h usando `cacheService.wrap('sitemap:xml', ...)` para evitar hits constantes.
- Añade test `backend/src/routes/__tests__/sitemap.spec.ts` que verifique al menos 1 `<loc>` dinámico.

### 2. Scripts de métricas
- Crear `scripts/collect_metrics.ts` que ejecute:
  - `lighthouse http://localhost:5173 --output=json --output-path=reports/lighthouse/<timestamp>.json` (usar `child_process`).
  - `k6 run k6/api/products.js --vus 20 --duration 30s` y guardar el resumen JSON.
  - Extraer FCP/LCP/CLS y escribir un archivo `reports/metrics/latest.json` para alimentar `metrics-dashboard.md`.
- Añade comandos npm:
```json
"metrics:collect": "ts-node scripts/collect_metrics.ts",
"test:k6:products": "k6 run k6/api/products.js"
```

### 3. Automatización de regresión
- Expandir `regression-suite.md` si agregas nuevos comandos.
- Opcional: crear workflow GitHub (`.github/workflows/ci.yml`) con jobs `metrics`, `k6`, `playwright`.

## Criterios de éxito
- `GET /sitemap.xml` devuelve productos reales (verifica manualmente con curl).
- `npm run metrics:collect` genera entradas en `reports/lighthouse/` y `reports/metrics/latest.json`.
- Scripts documentados y referenciados en `metrics-dashboard.md`.

## Verificación
```bash
cd backend && npm run test:ci -- --filter=sitemap
npm run metrics:collect
npm run test:k6:products
```
Guarda los logs en `reports/logs/<fecha>.txt` o adjúntalos en el PR.
