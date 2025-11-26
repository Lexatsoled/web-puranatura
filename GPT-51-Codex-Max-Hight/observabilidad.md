# Observabilidad, Métricas y Alertas

## Logs
- Logger estructurado (pino) con niveles info/warn/error/debug.
- Incluir `traceId`, `route`, `status`, `durationMs`, `userId?`.
- Scrub: sin PII/tokens/claves; truncar payloads >2kb.

## Trazas
- OpenTelemetry: instrumentar Express y axios (`useApi`); propagar `traceparent` y `x-request-id`.
- Sampling: prod 1-5% (ajustable); stage 100% para validación.

## Métricas (Prometheus)
- http_request_duration_seconds (p50/90/95/99) por método/route/status.
- error_rate por ruta; request_total; in-flight gauge.
- Negocio: orders_created, cart_add, auth_failed, analytics_ingested.
- Recurso: process_cpu_seconds_total, memory_rss, event_loop_lag.

## Dashboards (Grafana/LHCI/k6)
- API: latencias, error rate, throughput, rate-limit hits.
- Web: LCP/CLS/INP por release (LHCI uploads); bundle size histórico.
- Negocio: órdenes/día, conversión carrito→orden, búsquedas.

## Alertas (umbrales iniciales)
- API error_rate >0.5% (5m) → warn; >1% → page.
- API P95 >300ms (10m) → warn; >500ms → page.
- LCP >3s en main (LHCI) → warn.
- Cola analytics >500 pendientes (si se usa cola) → warn.
- Falta de scraping /metrics >5m → warn (exporter down).
- Burn-rate SLO: si consumo de budget >2x en 1h → warn; >4x → page.

## Monitoreo sintético
- Pings programados a home, store, product, login; flujo corto login→listar productos.
- Alertar si disponibilidad <99.5% en 7d o respuesta >1s sostenida.
- Configuración: usar GitHub Actions cron o servicio externo; guardar logs de runs y métricas de latencia/error.

## Health checks y smoke
- /api/health: DB reachable + version; /metrics accesible.
- Post-deploy: smoke (login, lista productos, crear orden demo en sandbox).

## Resiliencia y caos (opcional)
- Inyectar latencia/errores en stage para validar retry/circuit breaker.
- Umbrales de circuit breaker: abrir si error_rate ruta >5% en 1m y P95 >800ms; cerrar al estabilizar <1%.

## Tareas recurrentes
- Revisar dashboards semanal; test de restore backups trimestral.
- Ajustar budgets LHCI y k6 según evolución.

-## Artefactos verificables

- `reports/observability/metrics-snapshot.txt`: snapshot del endpoint `/metrics` después de golpear las rutas instrumentadas (`/`, `/api/health`, `/api/products`). Contiene los histogramas `http_request_duration_seconds_*`, los contadores `http_requests_total` y `http_request_error_rate_percentage`, el gauge `http_requests_in_flight` y los buckets de cola (`http_request_queue_duration_seconds`) que se pueden usar directamente en Grafana/LHCI para los dashboards de Fase 4.
- `reports/observability/trace-sample.md`: ejemplos JSON de `traceIdMiddleware` y `traceparent` impresos en los logs que permiten correlacionar spans con los paneles de burn-rate y alertas de SLO.
- `scripts/collect-metrics.ps1`: script reproducible que arranca el binario compilado (`backend/dist/server.js`), ejecuta las rutas esenciales y vuelca la cadena de métricas (`/metrics`) en `reports/observability/metrics-snapshot.txt` para mantener evidencia fresca sin necesidad de repetir todo el pipeline.
- `scripts/package-observability-artifacts.ps1`: copia los snapshots/lhci/playwright a `reports/observability/archive/` y genera `reports/observability/observability-artifacts.zip`, de modo que cada revisión o gate puede descargarse como un único artefacto para QA/SRE.
