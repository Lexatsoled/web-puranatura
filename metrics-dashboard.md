# Metrics Dashboard – Baseline vs Objetivos

| Métrica | Baseline (fecha / fuente) | Objetivo 2025Q4 | Cómo medir / Owner |
|---------|---------------------------|-----------------|--------------------|
| **LCP (mobile)** | 34.53 s – Lighthouse `lighthouse-real-2025-11-11_180123.report.json` | ≤ 2.5 s | `npm run analyze` (Lighthouse CI). Owner: Frontend/SRE. |
| **FCP (mobile)** | 14.17 s – mismo run Lighthouse | ≤ 1.8 s | `npm run analyze`. Validar en WebPageTest móvil. |
| **CLS** | 0.051 – Lighthouse (cumple AA) | ≤ 0.1 sostenido | Lighthouse + `web-vitals` reporter (`/api/analytics/vitals`). |
| **Total Byte Weight / payload de imágenes** | 5.96 MB – `total-byte-weight` Lighthouse | ≤ 2 MB | Luego de P3 (srcset). Ver columna `transferSize` en reportes. |
| **API `/api/v1/products` P95 TTFB** | **Pendiente** – capturar con `k6/api/products.js` (objetivo inicial 500 ms) | ≤ 300 ms | `k6 run k6/api/products.js --vus 20 --duration 1m` + export JSON. Owner: Backend. |
| **Checkout éxito / orders persistidas** | 0 % (checkout nunca llama al backend, ver `src/store/checkoutStore.ts`) | ≥ 95 % solicitudes con respuesta 201 | Añadir métrica (`orders_created_total / checkout_attempts_total`) en Prometheus. |
| **Errores frontend (Sentry)** | No instrumentado (VITE_SENTRY_DSN vacío) | < 0.5 % sesiones con errores fatales | Activar Sentry, exponer métricas desde `errorLogger`. Owner: Frontend. |
| **403 indebidos en `/admin/analytics/vitals`** | Sin control (ruta pública) | 0 accesos no autenticados | Logs de Fastify + alerta Loki. |

## Procedimiento de actualización
1. Ejecutar `npm run analyze` y guardar cada reporte en `lighthouse-reports/YYYY-MM-DD_HHmm/`.
2. Correr `k6` y exportar JSON a `reports/k6/api-products-<date>.json`. Documentar P95.
3. Después de cada fase del `fix-plan`, actualizar la tabla (nueva fila “post-fix” opcional) y adjuntar gráficas en `metrics/history/*.csv`.
4. Publicar resumen mensual en el README o en el tablero de observabilidad que se construirá en la Fase 4.
