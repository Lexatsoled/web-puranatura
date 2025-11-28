# CSP report monitoring (48h) — Ingest & metricization

Objetivo: poner la CSP en modo report-only, recolectar informes de violaciones durante 48h y evaluar si la tasa de bloqueos/errors es < 1% antes de activar `enforce`.

Qué hicimos (implementado):

- Endpoint receptor: `POST /api/security/csp-report` recibe `application/csp-report` y `application/json`.
- Persistencia local: `backend/reports/csp-reports.ndjson` (JSON Lines) — útil para auditoría y análisis forense.
  - Datos PII: los reports son pseudonimizados antes de persistir — IPs enmascaradas (ej. x.x.x.0/24) y `user-agent` almacenado como hash truncado.
- Métricas: Prometheus counters expuestos en `/metrics`:
  - `csp_reports_total{violated_directive,blocked_uri,report_only}`
  - `csp_reports_blocked_total{blocked_uri}`
- Helper: `scripts/compute-csp-metrics.cjs` calcula counts y % blocked.

Cómo desplegar en report-only for 48h (simplificado):

1. Asegúrate de tener la variable `CSP_REPORT_ONLY=true` (por defecto está true en el env). En producción la ruta de configuración debe ajustarla la plataforma.
2. Lanzar el backend con esa env var y confirmar `app` responde: `GET /` y `GET /metrics`.
3. Verifica que los reports llegan a `backend/reports/csp-reports.ndjson` (ndjson con timestamps).

Monitoreo y alertas (ejemplo Prometheus / Grafana):

- Prometheus scrape `/metrics` cada 15s.
- Regla de alerta (pseudo-PromQL) para detectar ratio de bloqueos > 1% en los últimos 48h:

  (increase(csp_reports_blocked_total[48h]) / increase(csp_reports_total[48h])) \* 100 > 1

- Crear un panel Grafana que muestre:
  - Total CSP reports (últimas 48h).
  - Blocked reports (por blocked_uri).
  - Ratio de bloqueo (%) — meta < 1%.

Validación manual con script local:

node scripts/compute-csp-metrics.cjs

Siguiente paso: si el ratio mantiene <1% durante 48h y no hay findigs operativos (terceros criticando contenido legítimo), preparar rollout a `enforce` vía canary (ver `docs/canary-rollout.md`).
