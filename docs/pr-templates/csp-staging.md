# PR: feat(staging): CSP report-only ingest + monitoring

## Descripción corta

Este PR añade soporte para recibir informes CSP en /api/security/csp-report (modo report-only), persistencia temporal de reports, métricas Prometheus para csp_reports_total y csp_reports_blocked_total, manifiestos de ejemplo para despliegue en infra/staging, configuración de scraping de Prometheus y regla de alerta de ejemplo para Grafana/Prometheus (ratio bloqueados en 48h > 1%).

## Por qué

Preparar al equipo para ejecutar un experimento de 48 horas en staging con CSP en modo report-only para identificar recursos rotos o recursos de terceros que causarían bloqueos cuando se habilite enforce.

## Checklist / pruebas que deben pasar en CI

- [ ] Lint (sin fallos críticos)
- [ ] Type-check
- [ ] Tests unitarios y de integración (vitest)
- [ ] /metrics expone contadores: csp_reports_total y csp_reports_blocked_total
- [ ] Infra (manifiestos de orquestador — opcional) añadidos en infra/ y workflow manual en .github/workflows/deploy-staging.yml

## Pasos para ejecutar localmente antes de push

1. Ejecutar linters y tests:
   - npm run lint
   - npm run type-check
   - npm run test:ci

2. Verificar que el backend expone /metrics y que contiene csp_reports_total (arrancar el backend y comprobar):
   - cd backend
   - npm ci
   - npm run dev
   - curl http://127.0.0.1:3001/metrics | Select-String csp_reports_total

3. Si quieres desplegar en staging manualmente, utiliza los manifiestos de ejemplo en `infra/` y aplica la manifest con la herramienta CLI o consola de tu proveedor (asegúrate del context/target y namespace/entorno).

## Notas operacionales

- El almacenamiento de reports en este PR es un PoC (NDJSON en disco). Para producción recomendamos persistir en DB o object storage y controlar la retención y privacidad de los reports.
- El almacenamiento de reports en este PR es un PoC (NDJSON en disco). Para producción recomendamos persistir en DB o object storage y controlar la retención y privacidad de los reports.
- Privacidad/PII: los informes son pseudonimizados por diseño (IPs enmascaradas y `user-agent` almacenado como hash truncado). Añadir tests en la CI que verifiquen que no se almacena PII sin autorización.
- El alertado y scraping proporcionados son ejemplos — adáptalos al entorno Prometheus/Grafana del cluster.

## Checklist para la fase de 48h (operación en staging)

- [ ] Desplegar con CSP_REPORT_ONLY=true y confirmar /api/security/csp-report recibe reports.
- [ ] Desplegar con CSP_REPORT_ONLY=true y confirmar /api/security/csp-report recibe reports.
- [ ] Validar que los reports persistidos no contienen IPs completas ni `user-agent` sin pseudonimizar (ejecutar test/unit que lo verifique).
- [ ] Confirmar Prometheus raspa /metrics y vemos incrementos en csp_reports_total.
- [ ] Esperar 48 horas y evaluar la ratio: increase(csp_reports_blocked_total[48h]) / increase(csp_reports_total[48h]) \* 100
- [ ] Si ratio < 1% → plan canary para habilitar enforce gradualmente.
