# Plan-mejora (Índice rápido)

Este directorio concentra toda la planificación, playbooks y esqueletos. Úsalo como única fuente para orientar a cualquier agente (incl. modelos ligeros).

## Cómo usar este directorio (orden recomendado)

1. Leer `Plan-Maestro.md` (visión por fases) y luego `Checklist-Plan-Maestro.md` (tareas).
2. Cuando un ítem lo requiera, abrir el playbook correspondiente:
   - Backups/Restore: `Runbook-Backups.md`
   - Secretos/escaneo: `Design-check-secret-drift.md`
   - Circuit breaker catálogo: `Breaker-Playbook.md`
   - Performance/A11y: `Perf-A11y-Playbook.md`
   - Contrato OpenAPI: `OpenAPI-Contract.md`
   - Mojibake: `Mojibake-Playbook.md`
   - SQLite WAL/monitoreo: `SQLite-WAL-Monitoring.md`
3. Si se necesita implementar, consultar los esqueletos (NO operativos):
   - `scripts/check-secret-drift.skeleton.cjs`
   - `scripts/openapi-drift.skeleton.cjs`
4. Plantillas de referencia:
   - `Secretos/.required.example.json`
   - `scripts/patterns/secrets.example.json`
   - `backups/README.md`
5. Escaneos rápidos:
   - `npm run scan:security` ejecuta gitleaks (reporte en `reports/gitleaks-report.json`) y Trivy (vuln+secret, reporte en `reports/trivy-report.json`).
6. SQLite (dev/staging):
   - WAL activo via `extensions = [wal]` en `prisma/schema.prisma`.
   - Pragmas sugeridos: `SQLITE_JOURNAL_MODE=wal`, `SQLITE_BUSY_TIMEOUT_MS=5000`, `SQLITE_SYNCHRONOUS=normal` (setear en entorno si se requiere ajustar).

## Rutas y convenciones

- Todos los paths son relativos a la raíz del repo.
- `Secretos/` debe existir en la raíz (está gitignored); aquí solo hay ejemplos.
- Los archivos en `Plan-mejora/scripts/*.skeleton.*` NO se deben ejecutar; deben copiarse/adaptarse fuera de este directorio antes de activarlos.
- Los `.env` reales (backend.env.local, frontend.env.local) viven en `Secretos/` y no se versionan.

## Archivos presentes (con propósito)

- `Plan-Maestro.md`: estrategia completa por fases, alcances, métricas y riesgos.
- `Checklist-Plan-Maestro.md`: lista accionable para marcar progreso.
- `Runbook-Backups.md`: snapshot/restore de SQLite + Secretos.
- `Design-check-secret-drift.md`: diseño del escaneo de secretos.
- `Breaker-Playbook.md`: operación del circuito de catálogo.
- `Perf-A11y-Playbook.md`: budgets y comandos para perf/a11y.
- `OpenAPI-Contract.md`: gates de contrato en CI.
- `Mojibake-Playbook.md`: detección, reparación y prevención de mojibake.
- `SQLite-WAL-Monitoring.md`: cómo verificar WAL, checkpoints y tamaños de archivo en PowerShell.
- `scripts/check-secret-drift.cjs`: escáner activo de secretos fuera de Secretos/.
- `scripts/patterns/secrets.json`: patrones activos para el escáner.
- `scripts/check-secret-drift.skeleton.cjs`: esqueleto del escáner de secretos.
- `scripts/openapi-drift.skeleton.cjs`: esqueleto de diff de OpenAPI.
- `scripts/setup-plan.cjs`: verificación de prerrequisitos (npm deps opcionales y binarios externos).
- `Secretos/.required.example.json`: plantilla de requisitos de secretos.
- `scripts/patterns/secrets.example.json`: patrones de detección de secretos.
- `backups/README.md`: estructura sugerida de snapshots.

## Comandos rápidos (referencia)

- Perf web: `npm run perf:web`
- A11y: `npm run a11y`
- k6 smoke API: `npm run perf:api` o `node scripts/run-k6.cjs GPT-51-Codex-Max/perf/k6-api-smoke.js`
- WAL checkpoint (si tienes sqlite3): `sqlite3 backend/prisma/dev.db "PRAGMA wal_checkpoint(TRUNCATE);"`
- OpenAPI lint: `npm run lint:openapi`
- OpenAPI contrato/mock: `npm run test:contract`
- OpenAPI drift: `npm run check:openapi-drift`
- Secretos: `npm run check:secret-drift`
- Backup seguro (VACUUM INTO): `npm run backup:safe`
- Tests backend (auth/products/CSP): `npm run test -- backend.*`
- Suite general: `npm run test:ci` (según package.json)
- Mojibake (búsqueda rápida):
  - `rg "ÃŸ|Ã'|‹¨«|Ã½Æ’'ÂªÆ’"½|Ã½Æ’'ÂªÂ"|Ã½Æ’'Âª"|Ã¿"` src backend pages components`
  - `rg "[^\\x00-\\x7F]" src backend pages components` (revisar manualmente)

## Prerrequisitos de herramientas (verificación rápida)

- gitleaks: `gitleaks version`
- k6: `k6 version`
- Playwright browsers: `npx playwright install chromium` (si no están)
- LHCI/Chrome headless: `npx lhci healthcheck` (requiere Chrome disponible)
- Script de setup: `npm run check:setup-plan` (informa de faltantes npm y binarios externos)
- Si faltan gitleaks/k6, instalarlos desde sus releases oficiales:
  - gitleaks: https://github.com/gitleaks/gitleaks/releases
  - k6: https://github.com/grafana/k6/releases

## Gates LHCI + Axe (Fase 3)

- El job `quality` dentro de `.github/workflows/ci-quality.yml` ejecuta `npm run a11y` y `npm run perf:web` (LHCI autorun) en pushes y PRs hacia `main`, asegurando que LCP < target y la puntuación de axe mantengan los thresholds antes de marcar la corrida verde.
- El job `main-guard` re-ejecuta `npm run perf:web` justo antes de terminar un push a `main`, lo que vuelve a verificar los budgets como última puerta.
- Para reproducir esos gates localmente: corre `npm run build`, luego `npm run perf:web`, seguido de `npm run a11y`. Los artefactos quedan en `reports/` (`lighthouse-mobile-latest.report.report.json`, `localhost_*.report.html`, `reports/axe-report.json`) para adjuntar evidencias cuando sea necesario.

## Artefactos de observabilidad (Fase 4)

- Usa `powershell -NoProfile -ExecutionPolicy Bypass ./scripts/collect-metrics.ps1` para arrancar el backend compilado, golpear `/`, `/api/health`, `/api/products` y `/metrics`, y refrescar `reports/observability/{metrics-snapshot.txt,trace-sample.md,perf-summary.md}` con los datos de latencia, errores y trazas del momento.
- Empaqueta todo con `powershell -NoProfile -ExecutionPolicy Bypass ./scripts/package-observability-artifacts.ps1` y valida el ZIP con `npm run verify:observability`. Los artefactos (incluido `reports/observability/observability-artifacts.zip`) deben acompañar cada gate de Fase 4 para mostrar latencias p95/p99 y tasa de errores (archivo `metrics-snapshot.txt`).
- El snapshot actual muestra p95 ~16 ms en `/api/products?page=1&pageSize=5`, p99 < 17 ms y `http_request_error_rate_percentage=0`, así que puedes usar esos valores como umbrales iniciales para alertas de latencia y 5xx en un dashboard de Grafana.

Además de los artefactos observability, Fase 4 requiere validar los contratos y el rendimiento API:

- `npm run perf:api` — k6 smoke (ya documentado en `reports/observability/perf-summary.md`) que entrega p95 96.93 ms y un error rate del 40 % porque el login (que necesita la tabla `main.User`) falla en la base de datos vacía. Guarda el log y reintenta después de sembrar datos reales.
- `npm run lint:openapi` y `npm run test:contract` — Spectral y Prism están ejecutados desde `.github/workflows/openapi-contract-tests.yml` y deben pasar antes de cerrar la fase. Úsalos localmente para validar cambios en `api/openapi.yaml`.

## Flags de ejecución (recomendados al implementar skeletons)

- `--dry-run` / `--report`: sugeridos para escáneres antes de habilitar “fail on error”.
- Exit codes esperados:
  - 0 = ok / solo warnings
  - 1 = hallazgos críticos (secreto fuera de Secretos, drift de OpenAPI)

## Variables de entorno críticas (dev defaults sugeridos)

- `PORT` (backend): 3001
- `ALLOWED_ORIGINS`: `http://localhost:5173`
- `CSP_REPORT_ONLY`: `true` en dev, `false` en prod
- `JWT_SECRET` / `JWT_REFRESH_SECRET`: valores seguros (en `Secretos/`), no vacíos
- `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW`: 300 / 900000 (15 min)
- `AUTH_RATE_LIMIT_MAX` / `AUTH_RATE_LIMIT_WINDOW`: 10 / 60000
- `ANALYTICS_RATE_LIMIT_MAX` / `ANALYTICS_RATE_LIMIT_WINDOW`: 20 / 300000
- `DATABASE_URL`: `file:./prisma/dev.db` (dev). Para tests/CI usa siempre esta ruta normalizada; si corres Vitest desde la raíz, exporta `DATABASE_URL=file:./prisma/dev.db` antes de `npm test`/`npm run test:ci` para evitar rutas duplicadas.
- `BREAKER_ENABLED`: `true|false` (cuando se implemente)
- `BREAKER_THRESHOLD` / `BREAKER_OPEN_TIMEOUT` / `BREAKER_HALF_OPEN_PROBES`: definir al habilitar breaker

# sync-note: Revisar/actualizar Plan-mejora/\*.md cada 4-6 semanas o tras cambios de stack

# sync-note: Revisar/actualizar Plan-mejora/\*.md cada 4-6 semanas o tras cambios de stack
