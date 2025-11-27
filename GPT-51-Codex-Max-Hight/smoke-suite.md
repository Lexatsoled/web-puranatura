# Smoke Suite Post-Deploy

Secuencia rápida (objetivo <5 min):

1. GET `/api/health` → 200 + version.
2. POST `/api/auth/login` con user de prueba → 200 y cookies seteadas (usa `SMOKE_USER=smoke@puranatura.test`, `SMOKE_PASS=SmokeP@ss123`).
3. GET `/api/products?page=1&pageSize=5` → 200, headers `X-Total-Count` y `ETag`.
4. POST `/api/orders` (sandbox) con item de stock → 201.
5. GET `/metrics` → 200 (prometheus text).
6. Frontend (opcional): abrir home y store en headless, verificar render básico.

Comando sugerido: `npm run smoke` (ya definido) con `BASE_URL` apuntando al backend y variables `SMOKE_USER`/`SMOKE_PASS` para probar login/orden demo.
