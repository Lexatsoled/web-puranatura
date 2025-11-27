# Plan k6 (API)

## Objetivos
- Validar P95 <300ms en rutas clave y error rate <0.5%.
- Smoke en CI; stress opcional en nightly.

## Escenarios
- Auth login (usuario válido, inválido, lockout).
- GET /products (paginado, search, ETag 304).
- POST /orders (stock suficiente/insuficiente).
- POST /analytics/events (payload válido/invalid).
- POST /ai/generate-text (prompt válido, timeout simulado).

## Perfiles
- Smoke: 1-5 VU, 1-2m, rps moderado.
- Stress (nightly): ramp 1→50 VU, 5m; thresholds error_rate<0.5, p95<400ms.
- Soak (opcional): 10-20 VU por 15-30m para detectar fugas o degradación.

## Thresholds recomendados
- `http_req_duration{scenario:auth}` p95 <300ms
- `http_req_failed` <0.005
- `checks` >0.99

## Integración CI
- `npm run perf:api` → scripts/run-k6.cjs con escenario smoke.
- Exportar resultados a `reports/k6-api-smoke.json` + resumen en CI logs.
