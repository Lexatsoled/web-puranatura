# Playbook: Circuit Breaker para Catálogo (/products)

Objetivo: evitar DoS y degradar con gracia cuando la DB de productos falla, sin reseed en tiempo de petición.

## Diseño operativo

- Alcance: endpoint `/api/products` (GET listado y GET por id).
- Estados del breaker:
  - `CLOSED`: opera normal.
  - `OPEN`: responde 503 inmediatamente con `X-Backend-Degraded: true`.
  - `HALF_OPEN`: permite pocas probes para revalidar salud.
- Umbrales sugeridos:
  - Fallos consecutivos: abrir tras 5 fallos de lectura/escritura en ventana de 30s.
  - En HALF_OPEN: permitir 1–3 requests; si todas OK, cerrar; si alguna falla, re-abrir.
- Temporizadores:
  - `openTimeout`: 60s antes de intentar HALF_OPEN.
  - `resetTimeout`: configurable vía env (p.ej. 120s) para entornos más lentos.

## Comportamiento en fallo

- No ejecutar seed dentro de la petición.
- Respuesta cuando OPEN:
  - HTTP 503
  - Headers: `X-Backend-Degraded: true`, `Retry-After: 30`
  - Body: `{ code: "CATALOG_DEGRADED", message: "Catálogo temporalmente no disponible" }`
- Loggear evento de apertura/cierre con traceId.
- Métrica: contador y gauge de estado (`breaker_state`) y de aperturas.

## Recuperación

- Health probe interna: simple `SELECT 1` o `prisma.$queryRaw` ligero antes de cerrar.
- Al cerrar: registrar evento y limpiar contadores de fallo.

## Integración sugerida (sin implementar aún)

- Middleware/servicio `catalogBreaker`:
  - `beforeHandler`: si OPEN => 503 inmediata.
  - `recordSuccess` / `recordFailure`: para update de estado.
  - Config vía env: `BREAKER_THRESHOLD`, `BREAKER_OPEN_TIMEOUT`, `BREAKER_HALF_OPEN_PROBES`.
- En `routes/products.ts`:
  - Registrar fallo en catch de DB.
  - Registrar éxito en respuestas 200/304.
  - No llamar a seed en catch; usar fallback legacy solo manual si se decide.

## Señales y alertas

- Alertar si:
  - Aperturas > 3 en 10 minutos.
  - Tiempo en OPEN > 5 minutos.
- Registrar `X-Backend-Degraded` para clientes y dashboards.

## Rollback

- Flag para desactivar breaker vía env (`BREAKER_ENABLED=false`) y volver a comportamiento actual, manteniendo logging.
- En caso de falsos positivos, incrementar umbral o abrir manualmente el circuito a HALF_OPEN para pruebas.

## Pruebas recomendadas

- Unit/integration:
  - Simular N fallos DB => estado OPEN y 503.
  - Probes exitosas => cierre.
  - Probes fallidas => re-OPEN.
- e2e/chaos local:
  - Apagar DB 2 min, verificar 503 + headers; reactivar DB y verificar cierre.
- k6 smoke (ligero):
  - Bajo carga moderada, sin aperturas si DB sana.

## Métricas de éxito

- p95 `/products` < 300ms en sano.
- 0 seeds en tiempo de petición.
- Breaker se abre solo en fallos reales y se cierra tras recuperación.
