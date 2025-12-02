# Runbook: Pipeline CI completo y canary releases

Este runbook describe cómo el workflow `ci-quality` (https://github.com/Lexatsoled/web-puranatura/blob/main/.github/workflows/ci-quality.yml) cubre T4.3 y cómo ejecutar el canary de T4.4.

## Pipeline CI (T4.3)

1. `ci-quality` se dispara en `push`/`pull_request` para `main`, `feat/*` y `fix/*`.
2. Pasos clave:
   - `npm run check:no-secrets`, limpieza Prisma y bloqueo de dirs sensibles.
   - Instalación de dependencias raíz y backend (`npm ci`, `npm --prefix backend ci`).
   - Migraciones (`prisma migrate deploy`) y seeds (`npm --prefix backend run seed`).
   - `npm run generate:sbom` para generar `sbom.json` (evidence de supply chain).
   - `npm run check:complexity`, `npm run lint`, `npm run format:check`, `npm run type-check`.
   - `npm run build`, `npm run test:ci`, `npm run test:contract`.
   - Backend en segundo plano (`node backend/dist/server.js`), instalación de Playwright y `npm run test:e2e`.
   - Instalación de k6 y `npm run perf:api`, seguido de `npm run a11y`, `npm run perf:web` (LHCI).
   - Seguridad: `node scripts/run-gitleaks.cjs`, `aquasecurity/trivy-action`, `npm audit --production --audit-level=high`.
   - `npm run verify:observability` (captura `reports/observability/metrics-snapshot.txt`, `trace-sample.md`, `perf-summary.md` y empaqueta `observability-artifacts.zip`).
   - Se suben artefactos: `test-results/**`, `reports/**`, `backend.log`, `sbom.json`.
3. El job `main-guard` (solo en `refs/heads/main`) repite build, `perf:web` y `npm audit` como última puerta antes del merge.

## Artefactos críticos

- `sbom.json` (SBOM CycloneDX generado por `npm run generate:sbom`).
- `reports/axe-report*.json`, `reports/lh-test.report.*`, `reports/lighthouse-*.report.*`, `reports/lhci/*.report.*` (perf + accesibilidad).
- `reports/observability/observability-artifacts.zip` (contiene métricas/trazas/perf/logs), `reports/observability/metrics-snapshot.txt` y `reports/observability/trace-sample.md`.
- Logs y resultados se adjuntan como artefacto `test-artifacts` (ver workflow) para auditar fallos.

## Rollout canary (T4.4)

1. Ejecuta `npm run rollout:canary` (alias de `node scripts/rollout-canary.cjs`). Por defecto actúa sobre `flag.analyticsIngest` y aplica rollouts en 5%, 25%, 50%, 100%.
2. Para otros flags define `CANARY_FLAG` (`CANARY_FLAG=flag.miFlag npm run rollout:canary`). Todos los flags deben existir en `config/flags.json` con la forma:
   ```json
   {
     "flag.miFlag": {
       "enabled": true,
       "rollout": 42
     }
   }
   ```
3. Después de cada escalado, valida que el backend sirva la flag adecuada (consulta `config/flags.json`, reinicia el servicio si cachea el fichero, revisa los logs con `requestLogger` para el nuevo `traceId`).
4. Tras finalizar un paso de canary, vuelve a ejecutar `node scripts/sample-metrics.ts` y `npm run perf:api`/`npm run perf:web` si necesitas validar impacto en latencia o uso de recursos.
5. Para revertir, ejecuta `node scripts/update-flag.cjs --flag flag.analyticsIngest --rollout 0 --enabled false` o usa el valor deseado.

## Integración y alertas

- Usa `reports/observability/dashboard-summary.md` para construir consultas Grafana con `http_request_error_rate_percentage`, `http_request_duration_seconds_summary{quantile="0.99"}` y `nodejs_eventloop_lag_p99_seconds`.
- Las alertas del canary deben activar cuando `http_request_error_rate_percentage > 1` o cuando `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[1m]))` supera tu umbral (e.g., 0.3 s).
- Documenta cada canary en el ticket/PR con enlaces a `reports/observability/observability-artifacts.zip`, `sbom.json`, `reports/lighthouse-*.report.html` y `reports/axe-report.json`.
- Tras cada ejecución de canary vuelve a correr `npm run synthetic:checks`; el JSON generado en `reports/synthetic/synthetic-report.json` sirve para comparar latencias (login/catálogo/checkout) con los paneles de Grafana y detectar divergencias (p95/p99/error-rate) antes de escalar al siguiente porcentaje.

Fin del runbook – registrar artefactos, actualizar `docs/phase-checkpoints.md` y `GPT-51-Codex-Max-Hight/CheckList.md` tras cerrar los pasos de Sprint 2.
