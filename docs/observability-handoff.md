# Handoff Observabilidad F4.2/T4.6

Este paquete describe qué entregar a QA/SRE para cerrar el gate de observabilidad antes de avanzar a Fase 5.

## Artefactos recién generados (27 Nov 2025 13:42Z)

- `reports/observability/metrics-snapshot.txt`: buckets de latency/error para rutas clave (`/`, `/api/health`, `/api/products`, `/metrics`).
- `reports/observability/trace-sample.md`: trazas de ejemplo con `traceId`, latencia y spans instrumentados.
- `reports/observability/perf-summary.md`: resumen de `npm run perf:api`, `npm run perf:web` y `npm run test:e2e`.
- `reports/observability/collect-metrics-server.stdout.log` + `.stderr.log`: logs del script para auditoría.
- `reports/observability/observability-artifacts.zip`: ZIP que incluye los ficheros anteriores junto con `reports/observability/archive/`.

## Qué debe verificar QA/SRE

1. Desempeño de dashboards (error_rate, P95, queue) sigue dentro de presupuesto usando `metrics-snapshot.txt`.
2. Alertas/traces capturan `traceId` en headers y el ZIP contiene evidencia de este campo.
3. Ejecutar `reports/observability/collect-metrics-server.log` y `perf-summary.md` para confirmar que los scripts `scripts/collect-metrics.ps1` y `package-observability-artifacts.ps1` corrieron sin errores.

## Siguiente paso tras verificación

- Marcar la evidencia en `docs/phase-checkpoints.md` Fase 4 como revisada.
- Avanzar con la automatización del pipeline + canary/feature flags (T4.3/T4.4) y empezar la priorización de la refactorización de Fase 5 (`reports/complexity-report.json`, `docs/phase-checkpoints.md` Fase 5).

Este doc puede adjuntarse al artefacto ZIP o incluirse en el paquete de entrega para QA/SRE.
