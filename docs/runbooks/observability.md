# Runbook: Observabilidad (trazas y métricas)

Este runbook describe los pasos comprobados para garantizar que el backend exporta trazas OpenTelemetry completas, expone el `traceId` en cabeceras/respuestas y publica métricas Prometheus clave (p95/p99, error rate, contadores, cola y recursos Node).

## Precondiciones

- Node 20+ y npm instalados.
- Variables opcionales de exportador: `OTEL_EXPORTER_OTLP_ENDPOINT` / `OTEL_EXPORTER_OTLP_HEADERS` si se quiere enviar trazas a un colector.
- `npm install` ya ejecutado para disponer de las dependencias del backend y los scripts de muestreo.

## Paso 1 – Validar las trazas y el `traceId`

1. Arranca el backend (`node backend/src/server.ts` o el script que prefieras). El middleware `traceIdMiddleware` arranca automáticamente el tracer (`backend/src/tracing/initTracing.ts`) y añade `X-Trace-Id`, `X-Request-ID` y `traceparent` a cada respuesta.
2. Ejecuta `curl -I http://localhost:3001/api/health` y comprueba que las cabeceras anteriores aparecen. Revisa los logs (el `requestLogger` incluye `traceId` en cada línea) para ver cómo se propaga el identificador.
3. Consulta `reports/observability/trace-sample.md` para ver trazas reales (por ejemplo, `traceId: 61f027a37afa1bd71a74b60281cb31c2` y spans `GET /api/health`, `GET /`). Estas salidas confirman que el span se crea con `SemanticAttributes.HTTP_*` y se cierra al finalizar la respuesta.

## Paso 2 – Capturar métricas Prometheus y los percentiles p95/p99

1. Ejecuta `node scripts/sample-metrics.ts` (o `npm run <script correspondiente>`) para disparar `/`, `/api/health`, `/api/products?page=1&pageSize=5` y `/metrics`, y grabar `reports/observability/metrics-snapshot.txt`.
2. Abre ese fichero para verificar que:
   - `http_request_error_rate_percentage` sigue en `0`.
   - `http_request_duration_seconds_summary` publica quantiles `0.95` y `0.99` para cada ruta (p. ej. 4.4587 ms a p95 para `GET /api/products?page=1&pageSize=5`).
   - `http_requests_total`, `requestDurationHistogram`, `http_requests_in_flight`, y `http_request_queue_duration_seconds` reflejan las muestras generadas.
   - Las métricas por defecto de Node (`nodejs_eventloop_lag_*`, `process_*`, `nodejs_active_handles`) están presentes.
3. Estos valores son la base para las alarmas de p95/p99 y la tasa de errores bajas; documenta los límites en el dashboard (ver paso 3).

## Paso 3 – Dashboard recomendado

1. Usa `reports/observability/dashboard-summary.md` como plantilla (paneles sugeridos y ejemplos de consultas) para crear un dashboard de Grafana llamado `PuraNatura API Observability`.
2. Paneles clave:
   - Latencia 95/99: `http_request_duration_seconds_summary{quantile="0.95"}` y `quantile="0.99"` filtrando por `route` y `method`.
   - Tasa de errores: `http_request_error_rate_percentage` y `http_request_errors_total`.
   - Throughput: `rate(http_requests_total[1m])` + `http_requests_in_flight`.
   - Recursos Node: `nodejs_eventloop_lag_p99_seconds`, `process_cpu_user_seconds_total`, `nodejs_heap_size_used_bytes`.
3. Añade anotaciones para cada despliegue y enlaza los dashboards con los logs/traceId para facilitar el triage (el traceId aparece en los `requestLogger` y en los spans de `trace-sample.md`).

## Paso 4 – Empaquetado y evidencia

1. Ejecuta `npm run verify:observability` para comprobar que existen `reports/observability/{metrics-snapshot.txt, trace-sample.md, perf-summary.md, collect-metrics-server.*}` y que `reports/observability/observability-artifacts.zip` los contiene.
2. Guarda el ZIP y los logs `collect-metrics-server.*` en el pipeline o release asociado a la tarea T4.1/T4.2.
3. Si necesitas más muestras, vuelve a correr `node scripts/sample-metrics.ts` y actualiza `reports/observability/metrics-snapshot.txt` antes de volver a comprimir con `scripts/package-observability-artifacts.ps1`.

Fin del runbook – tras validar trazas y métricas, documenta los hallazgos en el seguimiento maestro y adjunta los artefactos a los tickets correspondientes.
