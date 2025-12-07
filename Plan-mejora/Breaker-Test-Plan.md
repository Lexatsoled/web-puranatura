# Plan de prueba: Breaker catálogo (fallo/recuperación)

Objetivo: validar que el breaker de /products se abre ante fallo de DB y se cierra tras recuperación, sin reseed en tiempo de petición.

## Prerequisitos

- Entorno dev/staging.
- `BREAKER_ENABLED=true` y thresholds por defecto (o ajustados) en env.
- DB dev accesible (`DATABASE_URL` correcto).
- Comando para parar/arrancar DB (simulación).

## Configuración recomendada (env)

- `BREAKER_ENABLED=true`
- `BREAKER_THRESHOLD=5` (o más conservador, ej. 10)
- `BREAKER_WINDOW_MS=30000`
- `BREAKER_OPEN_TIMEOUT=60000`
- `BREAKER_HALF_OPEN_PROBES=2`

## Pasos de prueba (manual)

1. Estado sano:
   - Arrancar backend.
   - `curl -i http://localhost:3001/api/products` → 200 y items.
   - Opcional: k6 smoke ligero para ver p95 estable.
2. Inducir fallo DB:
   - Simular caída: renombrar `backend/prisma/dev.db` temporalmente o bloquear puerto (en dev).
   - Repetir 10 requests rápidas a `/api/products`.
   - Esperado: breaker OPEN → 503 con `X-Backend-Degraded: true`, `Retry-After: 30`.
3. Recuperación:
   - Restaurar DB (renombrar de nuevo o reactivar servicio).
   - Esperar `BREAKER_OPEN_TIMEOUT` (60s) y enviar 2–3 probes (requests).
   - Esperado: HALF_OPEN → CLOSED tras probes exitosas; respuestas 200.
4. Validar no reseed:
   - Revisar logs: no debe invocar seed en tiempo de petición.
5. Métricas/headers:
   - 503 en OPEN con headers.
   - 200 en CLOSED, sin `X-Backend-Degraded`.

## Automatización mínima (opcional)

- Comando listo: `npm run test:breaker` (scripts/test-breaker.cjs)
  - 3 requests baseline (espera 200)
  - Mueve `backend/prisma/dev.db` a `.bak` (simula caída) y lanza 10 requests (espera 503)
  - Restaura DB, espera `BREAKER_OPEN_TIMEOUT` y lanza 3 probes (espera 200)
  - Restaura `dev.db` si quedó en .bak

## Cómo forzar OPEN de forma más fiable (manual)

1. Parar backend.
2. Exportar `DATABASE_URL=file:./prisma/missing.db` y `BREAKER_ENABLED=true`.
3. Levantar backend y correr `npm run test:breaker` → se espera 503 en fase “caída”.
4. Restaurar `DATABASE_URL` correcto, reiniciar backend y repetir `npm run test:breaker` → se espera volver a 200.
5. Dejar `BREAKER_ENABLED` según política del entorno.

## Rollback

- Si el breaker se queda OPEN, setear `BREAKER_ENABLED=false` y reiniciar backend.
- Revisar thresholds si hay falsos positivos (subir `BREAKER_THRESHOLD`).

## Notas

- No ejecutar en prod; solo dev/staging.
- Mantener backup de `dev.db` antes de la prueba (usar `npm run backup:safe`).
