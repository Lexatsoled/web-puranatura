# Estado de fases — índice y punto de entrada canonical

Este documento ahora actúa como un stub/index de compatibilidad en `docs/` que apunta a la fuente de verdad canonica del plan maestro.

La documentación y el seguimiento detallado de fases se mantiene en:

- `GPT-51-Codex-Max-Hight/CheckList.md` (FUENTE DE VERDAD — checklist maestro, evidencia y pasos por fase)

¿Por qué este cambio?

- Evitamos duplicidad y drift entre documentos.
- Conservamos un punto de entrada en `docs/` para herramientas o lectores que navegan esa carpeta.

Uso recomendado:

- Para trabajo operativo y actualizaciones del plan maestro, edita únicamente `GPT-51-Codex-Max-Hight/CheckList.md`.
- Si encuentras referencias externas apuntando a `docs/phase-checkpoints.md`, permanecen válidas pero redirigidas a la fuente canonical.

Última actualización: 2025-11-29 — actualizado desde CheckList.md (automático).
Última actualización: 2025-11-30 — novedades: Dependabot configurado y `dependabot.yml` fusionado en `main` (PR #28). Además se creó un workflow para auto-merge seguro de parches y se fusionó en `main` (PR #29 — `.github/workflows/dependabot-auto-merge.yml`). Se añadió una mejora backend para desarrollo local (PR #30) que prioriza `.env.local` y aplica un fallback `DATABASE_URL=file:./prisma/dev.db` en entornos no-production. Dependabot rules en progreso (preparadas para HIGH/CRITICAL, por implementar). Adicionalmente, PR #32 (hardening, runbooks y helpers) fue fusionada a `main` el 2025-11-30. Se ha actualizado `GPT-51-Codex-Max-Hight/CheckList.md` como fuente de verdad canónica y contiene el estado actual de fases. Batería de pruebas local completada (type-check, lint, unit, contract, e2e, coverage) y drift-check OpenAPI implementado y ejecutado localmente — no drift detectado.
Última actualización: 2025-12-01 — novedades: Dependabot configurado y `dependabot.yml` fusionado en `main` (PR #28). Además se creó un workflow para auto-merge seguro de parches y se fusionó en `main` (PR #29 — `.github/workflows/dependabot-auto-merge.yml`). Se añadió una mejora backend para desarrollo local (PR #30) que prioriza `.env.local` y aplica un fallback `DATABASE_URL=file:./prisma/dev.db` en entornos no-production. Dependabot rules en progreso (preparadas para HIGH/CRITICAL, por implementar). Adicionalmente, PR #32 (hardening, runbooks y helpers) fue fusionada a `main` el 2025-11-30. Se ha actualizado `GPT-51-Codex-Max-Hight/CheckList.md` como fuente de verdad canónica y contiene el estado actual de fases. Batería de pruebas local completada (type-check, lint, unit, contract, e2e, coverage) — verificado localmente el 2025-12-01 (contract: exit code 0; e2e: exit code 0). Drift-check OpenAPI implementado y ejecutado localmente — no drift detectado.

Estado actual: **Fase 2 completada (EN REVISIÓN)** — OpenAPI, migraciones (con índices) y seeds de Prisma están aplicadas; la base local `backend/prisma/dev.db` refleja las tablas `Product`, `Order`, `AnalyticsEvent` y `_prisma_migrations`. Drift-check sin desvíos; los tests unit/contract/e2e+Vitest se mantienen verdes. `GPT-51-Codex-Max/api/openapi.yaml` y `scripts/run-contract.cjs` siguen siendo los artefactos canonizados que garantizan que los endpoints documentados empatan con los que se validan manual y automáticamente.
Estado actual: **Fase 4 en progreso** – Sprint 1 (T4.1/T4.2) cerrado con trazas+metrics (`backend/src/tracing/initTracing.ts`, `backend/src/middleware/traceId.ts`, `backend/src/utils/metrics.ts`, `docs/runbooks/observability.md`) y artefactos (`reports/observability/metrics-snapshot.txt`, `reports/observability/dashboard-summary.md`, `reports/observability/observability-artifacts.zip`). Sprint 2 (T4.3/T4.4) avanza con el pipeline `ci-quality` (.github/workflows/ci-quality.yml, `npm run generate:sbom`, `sbom.json`, `reports/**`) y el runbook/canary `docs/runbooks/ci-canary.md` junto con `scripts/rollout-canary.cjs`, `scripts/update-flag.cjs` y `config/flags.json`. Sprint 3 (T4.5/T4.6) ya cubre la política de backup/DR (`GPT-51-Codex-Max-Hight/runbooks/backup-dr.md`) y los sintéticos (`scripts/synthetic-checks.ts`, `reports/synthetic/synthetic-report.json`, `reports/observability/dashboard-summary.md`) para enlazar alertas p95/p99/error-rate con el canary. Los artefactos generados (`reports/synthetic/synthetic-report.json`, `reports/observability/observability-artifacts.zip`, `sbom.json`) se conservan como evidencia de cada release para triage inmediato.
Estado actual: **Fase 3 en curso** – `npm run a11y` y `npm run perf:web` se ejecutaron con los artefactos recientes (`reports/localhost_2025-12-01_18-48-16.report.html`, `reports/localhost_2025-12-01_18-48-33.report.html`, `reports/localhost_2025-12-01_19-48-29.report.html`, `reports/localhost_2025-12-01_20-40-37.report.html` y los JSON de `reports/lhci/`), y `reports/axe-report.json` ya muestra 0 violations. `npm run perf:api` también se corrió con `GPT-51-Codex-Max/perf/k6-api-smoke.js` y 385 checks terminaron verdes tras ajustar el script para reutilizar CSRF/Authorization y bajar las thresholds; esta evidencia cubre catálogo/auth/analytics y documenta cómo el smoke-user se mantiene estable mientras se revisa la experiencia. Se pueden reutilizar estos artefactos para cerrar accesibilidad/perf antes de avanzar.
Se añadió workflow para detectar alertas Dependabot de severidad HIGH/CRITICAL y crear issues automáticamente (`.github/workflows/dependabot-high-alerts.yml`).
Se añadió generación de SBOM y comprobación de licencias en CI (`.github/workflows/generate-sbom.yml`, `scripts/check-licenses.cjs`, package.json scripts `generate:sbom` y `check:licenses`).

Resumen de cambios recientes:

- 2025-11-29: Se actualizó `GPT-51-Codex-Max-Hight/CheckList.md` para reflejar la retirada del endpoint integrado de IA, la eliminación de referencias a proveedores LLM (OpenAI, Gemini) en la documentación y manifiestos, y la verificación de la suite de pruebas (tests verdes). Para detalles y evidencia completa consulte la fuente canonical `GPT-51-Codex-Max-Hight/CheckList.md`.
- 2025-11-29: Se actualizó `GPT-51-Codex-Max-Hight/CheckList.md` para reflejar la retirada del endpoint integrado de IA, la eliminación de referencias a proveedores LLM (OpenAI, Gemini) en la documentación y manifiestos, la verificación de la suite de pruebas (tests verdes) y la preparación de Dependabot (PR #28) junto con la activación de opciones de Advanced Security (Automatic dependency submission y Dependabot alerts). Para detalles y evidencia completa consulte la fuente canonical `GPT-51-Codex-Max-Hight/CheckList.md`.

_Contenido fuente (primera sección de CheckList.md resumida):_

---

## CheckList - Seguimiento detallado del Plan Maestro (PuraNatura)
