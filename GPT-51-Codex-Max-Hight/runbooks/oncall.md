# Runbook: Oncall (resumen)
- Monitorear alertas en: error_rate, P95, LCP (LHCI), disponibilidad /metrics, seguridad (gitleaks/audit fallos en CI main).
- Primeros 5 minutos: confirmar si es real (logs/metrics), abrir incidente si SEV1/2.
- Escalar a: Backend (auth/orders), Frontend (UI/LHCI), SRE (infra/CI), Sec (secrets/CSP).
- Herramientas: dashboards Grafana/LHCI/k6, logs estructurados (pino), trace viewer.
- Cierre: smoke tests, reporte de causa, ticket follow-up asignado.
