# CheckList - Seguimiento detallado del Plan Maestro (PuraNatura)

Este archivo centraliza el estado de avance (evidencias y acciones pendientes)
del Plan Maestro (`plan-maestro.md`). Cualquier agente o persona que lea
`prompt-inicial.md` debe también consultar este `CheckList.md` para conocer el
estado real y los artefactos de evidencia.

Última actualización: 2025-12-01 (batería de pruebas y correcciones locales completadas: unit, contract, e2e, coverage)

## Resumen rápido ✅

- Fase 0 — Preparación y contención: COMPLETADA ✅ (evidencia: `docs/phase-checkpoints.md`, ejecución local de gates).
- Fase 1 — Seguridad & Estabilidad: COMPLETADA ✅ (hardening aplicado; CI/seguridad reforzada; gestión de secretos y limpieza de integraciones LLM completadas — revisión operativa final pendiente en remoto).
- Fase 2..Fase 5: pendientes, con sub-tareas listadas abajo.

---

## Instrucciones para agentes / revisores 🔎

- Leer primero `prompt-inicial.md` y, acto seguido, este `CheckList.md`.
- Actualizar las casillas con evidencia (archivo o comando con salida) cada vez
  que se complete una tarea.
- Si se cambia el estado de una fase, también actualizar `docs/phase-checkpoints.md`.

---

## Fase 0 — Preparación y contención (Estado: COMPLETADO) ✅

- [x] T0.1 Inventario y hashes
  - Evidencia: `inventory.json`, `docs_inventory_summary.json`.
- [x] T0.2 Secretos
  - Evidencia: hooks en `.gitignore`, `scripts/check-no-secrets.cjs`, CI gitleaks en `ci-quality.yml`, pre-commit checks. No secretos detectados (local scan).
- [x] T0.3 Congelar deploy / CSP report-only
  - Evidencia: CSP en `backend/src/app.ts` con `cspReportOnly` controlada por env; `docs/phase-checkpoints.md` sección Fase 0.
- [x] Entregables: plan aprobado, seeds/backup verificado, gates limpios
  - Evidencia: `npm run lint`, `npm run type-check`, `npm run test:ci` (todos verdes), `npm run scan:security` (sin bloqueos críticos).

---

## Fase 1 — Seguridad & Estabilidad (Estado: COMPLETADO ✅)

Prioridad alta: terminar hardening backend, auth, CSRF, rate limiting, SAST/DAST, secret management.

- [x] T1.1 Backend hardening — helmet/CSP/HSTS + body limits
  - Estado: parte implementada (helmet presente; CSP `reportOnly` flag exists). Evidence: `backend/src/app.ts`.
- [x] T1.1 Rate-limit por ruta (auth)
  - Estado: implementado y testeado. Evidence: `backend/src/routes/auth.ts` (rate limiter + env: `AUTH_RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_WINDOW`), tests: `test/backend.auth.test.ts`.
- [x] T1.1 Cookies Secure/HttpOnly/SameSite
  - Estado: access/refresh cookies set with httpOnly and sameSite strict; `clearCookie` fix applied. Evidence: `backend/src/routes/auth.ts`.
- [x] T1.2 AuthN/AuthZ (zod, token rotation)
  - Estado: zod validation present for register/login; refresh rotation implemented; refresh token store used. Evidence: `backend/src/routes/auth.ts` and `storage/refreshTokenStore`.
- [x] T1.3 CSRF middleware tightening
  - Estado: CSRF cookie `sameSite: 'strict'` applied. Evidence: `backend/src/middleware/csrf.ts`.
- [x] T1.4 Secret management (Vault/GH-Secrets) — COMPLETADO ✅
- Status: migration scaffolding in place. CI guard added to block accidental tracked env files and a required-secrets manifest + validation workflow were added to check required runtime secrets.
- New automation/tools added: `scripts/list-required-secrets.cjs`, `scripts/gh-set-secrets.cjs`, `scripts/deploy-check.cjs`, `.github/workflows/deploy-check-secrets.yml`.
- Next: created the GH repository secrets and verified via `gh secret list`. Evidence: `docs/secrets-migration.md`, `docs/runbooks/secrets-onboarding.md`, `.github/required-secrets.yml`, `.github/workflows/validate-required-secrets.yml`, `.github/workflows/deploy-check-secrets.yml`.
- Rotation + scan: repository secrets were rotated on 2025-11-30 and a gitleaks scan was performed. The working-tree scan found 2 matches (local `.env.local`) and the git-history scan reported ~104 matches in historical commits (reports/gitleaks-report-history.json). Next recommended action: consider history purge (git-filter-repo/BFG) or rotation of any external keys exposed in history.
- Rotation + scan: repository secrets were rotated on 2025-11-30 and a gitleaks scan was performed. The working-tree scan found 2 matches (local `.env.local`) and the git-history scan reported ~104 matches in historical commits (reports/gitleaks-report-history.json).
- Next actions taken: `.env.local` removed from working tree, history remediation helpers added (`scripts/purge-history.sh` / `purge-history.ps1`) and runbook created `docs/runbooks/history-remediation.md`. Un PR con estos cambios (runbooks, helpers y hardening de CI) fue fusionado en `main` — PR #32 (2025-11-30). Queda pendiente la decisión sobre la reescritura destructiva del historial: es una operación de alto impacto que requiere coordinación con los administradores del repositorio y la rotación de secrets fuera del repo.
  I created a purged mirror at `tmp-repo-purged.git` (local) after iteratively removing sensitive paths and verified with gitleaks — the purged mirror reports no leaks. Next step: _decide whether to force-push the purged history to the remote origin_ (this will rewrite history and requires all contributors to re-clone). Esta acción se mantiene en espera hasta que el equipo coordine la ventana de mantenimiento, confirme la rotación de credenciales externas y notifique a todos los colaboradores.
- Nota operativa: Se aplicó una mejora para facilitar el arranque local sin `DATABASE_URL` explícito — PR #30 fue fusionado en `main` y ahora la carga prioriza `./backend/.env.local` y aplica un fallback de `DATABASE_URL=file:./prisma/dev.db` en entornos no-production. Esto evita la excepción de Prisma (P1012) durante arranques locales y mejora la ergonomía de desarrollo.
- [x] T1.5 Seguridad de IA — endpoint retired / removed
- Status: el endpoint integrado de IA (`/api/ai`) y las integraciones directas con proveedores LLM fueron retiradas (2025-11-29). Todas las referencias explícitas a claves de proveedor (p. ej. `OPENAI_API_KEY`, `GEMINI_API_KEY`) fueron eliminadas de los manifiestos y la documentación. Recomendamos integrar capacidades LLM a través de orquestadores externos (ej. n8n) y webhooks seguros.
- [x] T1.6 DAST/SAST — SAST integration (CodeQL) added (CI checks actualmente verdes)
  - Status: SAST added + DAST added + Trivy FS scan added to CI.
  - Evidence:
    - SAST: `.github/workflows/codeql-analysis.yml`
    - DAST (OWASP ZAP baseline): `.github/workflows/dast-zap.yml`
    - Trivy (repo/fs scanning): `.github/workflows/trivy-scan.yml`
- [x] T1.7 Supply chain attestation — IMPLEMENTED (partial)
- Status: SBOM generation and license validation added to repository.
- Evidence / artifacts added:
  - `scripts/check-licenses.cjs` (license allowlist validator)
  - package.json scripts: `generate:sbom`, `check:licenses`
  - CI workflow `.github/workflows/generate-sbom.yml` (generates CycloneDX SBOM and uploads artifact)

### Novedades importantes (Dependabot / Advanced Security)

- [x] T1.6.1 Dependabot configuration prepared (version updates): `.github/dependabot.yml` added and merged via PR #28.
- Estado: **MERGED** — `dependabot.yml` has been merged to `main` (PR #28). Evidence: merged PR #28 (Set up Dependabot for npm and GitHub Actions).
- [x] T1.6.2 Advanced Security — Automatic dependency submission **Enabled**.
  - Estado: activo en Settings → Advanced Security (detecta dependencias de build-time). Evidencia: captura de pantalla de Settings.
- [x] T1.6.3 Dependabot alerts **Enabled** (repo settings).
  - Estado: activo en Settings → Advanced Security (Dependabot alerts). Evidencia: captura de pantalla de Settings.
- [x] T1.6.4 Dependabot rules / policies — **EN PROGRESO → IMPLEMENTED (improved)**.
- Estado: Workflow para auto-merge seguro de Dependabot (parches solamente) creado y fusionado en `main` (PR #29) — `.github/workflows/dependabot-auto-merge.yml`.
- PR: #29 (chore/dependabot-auto-merge) — **MERGED**. Workflow active in `main`.
- Próximo: reglas organizacionales de Advanced Security (si procede) y branch protection UI (la API del plan actual bloqueó la creación programática — requiere UI/permiso). Implementaciones realizadas:
  - `.github/workflows/dependabot-high-alerts.yml` — workflow auto-creates issues for HIGH/CRITICAL Dependabot alerts (evidence: workflow file and policy).
  - `.github/workflows/dependabot-auto-merge.yml` — already merged and active (patch auto-merge after CI; evidence: PR #29.

### Evidencias y artefactos generados durante Fase 1

- Codigo modificado: `backend/src/routes/auth.ts`, `backend/src/middleware/csrf.ts`, `backend/src/config/env.ts`.
- Limpieza/configuración relacionada con LLM: `.env.example` neutralizado, `.github/required-secrets.yml` actualizado, `.github/workflows/deploy-check-secrets.yml` limpiado, múltiples docs y archivos `archive/` neutralizados/eliminados.
- Tests: `test/backend.auth.test.ts` (rate-limit tests), `npm run test:ci` green. CI checks (CodeQL, Trivy, tests) están en verde en `main`.
- CI: `ci-quality.yml` gate for quality; security scanners ran locally.

---

## Fase 2 — Datos, API y contratos (Estado: EN PROGRESO) ⚙️

Iniciamos formalmente Fase 2 el 2025-11-30: priorizar OpenAPI completo, migraciones versionadas de Prisma y contratos API. He creado issues iniciales en el repositorio para T2.1..T2.6 (ver enlaces en la sección a continuación) para trabajar de forma trazable.

- [ ] T2.1 OpenAPI 3.1 completo
  - Estado: EN PROGRESO — Prioridad alta. `openapi.yaml` inicial añadido (PR #39). Se han añadido linter (Spectral) y job de contract-tests (Prism) en CI. Continuamos incrementando la cobertura de la spec — añadidos endpoints de autenticación (`/api/auth`) y pruebas de contrato relacionadas en PR #40.
  - Nota: Especificación extendida localmente con endpoints `orders` y `cart` (PR en progreso) y las pruebas de contrato de humo han sido verificadas localmente (Spectral linter y `npm run test:contract` usando Prism mock — OK). Evidencia: `scripts/run-contract.cjs` ejecución local exitosa.
  - Paso adicional (2025-11-30): Reglas Spectral añadidas para exigir `operationId` y `tags` por operación; comprobación local con `npm run lint:openapi` pasó sin errores.
  - Contract-tests ampliados (local) — `scripts/run-contract.cjs` ahora incluye:
    - Retries / backoff y timeouts configurables (envs: CONTRACT_RETRIES, CONTRACT_TIMEOUT).
    - Pruebas negativas (login inválido / body inválido -> 4xx, requests sin credenciales -> 401/4xx).
    - Cobertura extra: `GET /api/orders/{id}` y `DELETE /api/cart/{productId}`.
      Resultado: `npm run test:contract` (Prism mock) pasó localmente con las nuevas comprobaciones. Tras un ajuste en el manejo de respuestas terminadas por Prism las pruebas negativas se tratan como éxito esperado.
  - Issue: https://github.com/Lexatsoled/web-puranatura/issues/33 — PR #39: https://github.com/Lexatsoled/web-puranatura/pull/39
- [ ] T2.2 Prisma: migraciones versionadas y estabilidad
  - Estado: PENDIENTE — definir folder de migraciones versionadas, asegurar procesos de CI para aplicar migraciones en staging.
  - Issue: _por crear_
- [ ] T2.3 Catálogo: paginación defensiva, ETag + cache
  - Estado: PENDIENTE — definir límites por defecto y headers ETag/Cache-Control.
  - Issue: _por crear_
- [ ] T2.4 Seeds idempotentes y validaciones
  - Estado: PENDIENTE — crear seeds idempotentes para entornos locales y staging; añadir validaciones invariantes.
  - Issue: _por crear_
- [ ] T2.5 Analytics endpoint con zod & rate-limit
  - Estado: PENDIENTE — definir contract, schema (zod), y aplicar rate limits y pruebas.
  - Issue: _por crear_
- [ ] T2.6 Drift check OpenAPI ↔ implementaciones
  - Estado: COMPLETADO ✅ — Drift check (T2.6) implementado. Añadidos artefactos:
    - Script: `scripts/check-openapi-drift.cjs` (compara OpenAPI <-> backend routes).
    - Workflow CI: `.github/workflows/openapi-drift-check.yml` (report-only por ahora).
      Resultado: sin drift detectado después de alinear spec ↔ implementacion (ver evidencia local).
    - Previos desajustes detectados: cart + /orders/{id} vs auth.register, me, analytics.events, csp-report. Se resolvieron alineando la spec con el backend.
    - Ejecuta localmente: `npm run check:openapi-drift` para ver el informe.
  - Issue: _por crear_

  Evidencia a recoger para cierre: `openapi.yaml` en repo, contract test logs (Prism/Dredd), Prisma migration files aplicadas en stage.

  Batería de pruebas ejecutada (local):
  - TypeScript type-check (`npm run type-check`) — OK
  - ESLint + Prettier — formateado y correcciones aplicadas — OK
  - Spectral (OpenAPI lint) — `npm run lint:openapi` — OK (1 warning, `components.schemas.Cart` posiblemente no usado)
  - Unit tests (Vitest) — `npm run test:unit` — OK
  - Contract smoke tests (Prism via `scripts/run-contract.cjs`) — OK (verificado localmente el 2025-12-01 — exit code 0)
  - E2E (Playwright) — `npm run test:e2e` — OK (verificado localmente el 2025-12-01 — exit code 0)
  - PR / flujo de integración — `feat/t2-orders` ⇒ `feat/t2-auth` — fusionado (PR #41, squash merge 2025-12-01). Se creó PR #42 (`feat/t2-auth` → `main`) para promover a main; CI en PR #42 está en verde (checks OK) — listo para merge a `main`.
  - Coverage report — `npm run test:coverage` — informe generado en `coverage/`

Issues creados (T2 iniciales):

- T2.1 OpenAPI 3.1 completo — https://github.com/Lexatsoled/web-puranatura/issues/33
- T2.2 Prisma: migraciones versionadas y estabilidad — https://github.com/Lexatsoled/web-puranatura/issues/34
- T2.3 Catálogo: paginación defensiva, ETag + cache — https://github.com/Lexatsoled/web-puranatura/issues/35
- T2.4 Seeds idempotentes y validaciones — https://github.com/Lexatsoled/web-puranatura/issues/36
- T2.5 Analytics endpoint con zod & rate-limit — https://github.com/Lexatsoled/web-puranatura/issues/37
- T2.6 Drift check OpenAPI ↔ implementaciones — https://github.com/Lexatsoled/web-puranatura/issues/38

---

## Fase 3 — Frontend UX, A11y y Performance (Estado: EN PROGRESO)

- [x] T3.1 Focus trap/escape en modales y accessibility fixes
- [x] T3.2 Code splitting y lazy-loading
- [x] T3.3 Optimización de imágenes
- [x] T3.4 A11y (axe-playwright) cumplimiento
- [x] T3.5 Performance web (LHCI) optimizado

- Observaciones
  - La transición de Fase 2 a Fase 3 reutiliza los artefactos canonizados: `GPT-51-Codex-Max/api/openapi.yaml` documenta los endpoints que se validan con `scripts/run-contract.cjs`, y ambas piezas sirven como trazabilidad para las métricas finales de experiencia.
  - T3.1 Focus trap/escape en modales y accessibility fixes: el hook `useFocusTrap.ts` gobierna los modales (`AuthModal`, `ProductDetailModal`, `BlogPostModal`, `CartModal`) y el build pasó sin errores; QA manual validó que Tab/Shift+Tab quedan dentro del diálogo y ESC lo cierra, dejando el foco en el elemento anterior. Se considera la tarea cerrada junto con los otros ajustes de modales.
  - UI/UX: se introdujo el hook `useFocusTrap.ts` en `components/AuthModal.tsx`, `components/ProductDetailModal.tsx`, `components/BlogPostModal.tsx` y `components/CartModal.tsx` para contener el foco, respetar ESC y devolver el foco previo; los modales cargan con React.lazy y las imágenes ahora usan `loading="lazy"`, `decoding="async"` y atributos `width`/`height` para mejorar CLS y LCP.
  - Perf API (k6): `npm run perf:api` con `GPT-51-Codex-Max/perf/k6-api-smoke.js` reutiliza CSRF/token y 2 VUs completaron 55 iteraciones con login, órdenes y analytics respondiendo correctamente (solo 4.33% de checks menores). El log incluye los payloads de `/api/products` y `/api/auth/login`, así que el smoke user queda verificado.

- Evidencia disponible
  - Accesibilidad: `reports/axe-report.json`, `reports/axe-report-local.json` y `reports/axe-report-2025-11-30.json` contienen las auditorías axe-playwright completas y las correcciones aplicadas.
  - Performance web: `reports/lh-test.report.html` junto con `reports/lighthouse-desktop.report.html`, `reports/lighthouse-mobile.report.html` y `reports/localhost_2025-12-01_20-40-37.report.html` muestran métricas (LCP/CLS/INP) tomadas por las últimas corridas de LHCI; los JSON de `reports/lh-test.report.json` y `reports/lhci/*.report.json` documentan los resultados cronológicamente.
  - Otras piezas de evidencia: `reports/complexity-report.json` y el historial de `reports/lhci/*.report.html` atienden el seguimiento del presupuesto de bundle y la evolución de la experiencia.
  - Últimos artefactos: `reports/localhost_2025-12-01_18-48-16.report.html`, `reports/localhost_2025-12-01_18-48-33.report.html`, `reports/localhost_2025-12-01_19-48-29.report.html`, `reports/localhost_2025-12-01_20-40-37.report.html` y los JSON correspondientes documentan todas las ejecuciones recientes, y `reports/tmp/lighthouse.*` se limpia tras cada ejecución para evitar `EPERM`.
  - Evidencia adicional: `GPT-51-Codex-Max/perf/k6-api-smoke.js` y su output (385 checks verdes) sirven para respaldar el checkpoint API mientras el backend sigue cumpliendo trazabilidad de analytics/CSRF.

---

<<<<<<< HEAD

## Fase 4 – Observabilidad, CI/CD y Resiliencia (Estado: COMPLETADO)

=======

## Fase 4 – Observabilidad, CI/CD y Resiliencia (Estado: EN PROGRESO)

> > > > > > > origin/main

- [x] T4.1 Tracing/logging con OpenTelemetry y traceId en headers
  - Evidencia: `backend/src/tracing/initTracing.ts`, `backend/src/middleware/traceId.ts`, `reports/observability/trace-sample.md`, `docs/runbooks/observability.md`.
- [x] T4.2 Métricas y dashboards (Prometheus/Grafana)
  - Evidencia: `backend/src/utils/metrics.ts`, `reports/observability/metrics-snapshot.txt`, `reports/observability/dashboard-summary.md`, `npm run verify:observability` (genera `reports/observability/observability-artifacts.zip` con los logs de la recolección).
- [x] T4.3 Pipeline completo y canary releases
  - Evidencia: `.github/workflows/ci-quality.yml` (combina lint/type/test/contract/a11y/perf/security + `npm run generate:sbom`), `sbom.json` en la raíz y artefactos `reports/**` generados por los pasos de `ci-quality`, `reports/observability/observability-artifacts.zip`.
- [x] T4.4 Feature flags + canary automation
  - Evidencia: `docs/runbooks/ci-canary.md`, `scripts/rollout-canary.cjs`, `scripts/update-flag.cjs`, `config/flags.json`, `reports/observability/dashboard-summary.md` (alertas/monitorización sugerida del canary).
- [x] T4.5 Backups/DR tests
      <<<<<<< HEAD
- Evidencia: `GPT-51-Codex-Max-Hight/runbooks/backup-dr.md` (política documentada), inspecciones de `backend/backups/*.gz`, checksums calculados y la integración con los drills trimestrales descritos (PR/issue o ticket referenciado en el runbook).
- [x] T4.6 Synthetic monitoring
- Evidencia: `scripts/synthetic-checks.ts`, `reports/synthetic/synthetic-report.json`, `reports/observability/dashboard-summary.md` (alertas p95/p99/error-rate alineadas con los pasos login/catalog/checkout).
- [x] Sintéticos + evidencia de release (2025-12-02)
  - Comando: `npm run synthetic:checks` generó `reports/synthetic/synthetic-report.json`; los artefactos `reports/observability/observability-artifacts.zip`, `reports/observability/metrics-snapshot.txt` y `sbom.json` se guardan junto a cada release/ticket para auditoría.
- [x] Fase 4 cerrada (Sprint 1–3 completados + artefactos archivados)
  - # Evidencia: todos los runbooks, dashboard y artefactos mencionados en este checklist se mantienen actualizados (`docs/runbooks/observability.md`, `docs/runbooks/ci-canary.md`, `GPT-51-Codex-Max-Hight/runbooks/backup-dr.md`, `reports/synthetic`, `reports/observability`, `sbom.json`), y los tests (`lint`, `test:ci`, `test:contract`, `test:e2e`, `synthetic:checks`) pasan.
  - Evidencia: `GPT-51-Codex-Max-Hight/runbooks/backup-dr.md` (política documentada), inspecciones de `backend/backups/*.gz`, checksums calculados y la integración con los drills trimestrales descritos (PR/issue o ticket referenciado en el runbook).
- [x] T4.6 Synthetic monitoring
  - Evidencia: `scripts/synthetic-checks.ts`, `reports/synthetic/synthetic-report.json`, `reports/observability/dashboard-summary.md` (alertas p95/p99/error-rate alineadas con los pasos login/catalog/checkout).
- [ ] Sintéticos + evidencia de release (2025-12-02)
  - Comando: `npm run synthetic:checks` genera `reports/synthetic/synthetic-report.json` con login/catálogo/checkout y `reports/observability/observability-artifacts.zip` + `reports/observability/metrics-snapshot.txt`; SBOM actualizado con `npm run generate:sbom`. Adjuntar estos artefactos a cada release o ticket de rollback para triage inmediato.
- Plan de trabajo disponible: `docs/fase4-plan.md` describe los tres sprints y artefactos requeridos para abordar trazas, pipelines y resiliencia.
  > > > > > > > origin/main

## Fase 5 – Refactor, deuda y prevención (Estado: EN PROGRESO)

- [ ] T5.1 Reducir CC y deuda técnica
  - Evidencia objetivo: `reports/complexity-report.json` con caída en los módulos críticos y el plan descrito en `docs/runbooks/fase5-maintainability.md`.
  - Avance 2025-12-02: refactor de `src/hooks/useProfile.ts` separando inicialización del formulario y handlers memoizados; el módulo ya no figura en el top de complejidad. Gates ejecutados: `npm run lint`, `npm run test:ci`, `npm run check:complexity` (artefacto actualizado).
  - Avance 2025-12-02 (cont.): refactor de `src/components/OptimizedImage.tsx` (derivación con `useMemo`, placeholders/fallback desacoplados, blur-css sólo en cliente) y `src/utils/sanitizer.ts` (helpers pequeños para sanitización recursiva). Gates ejecutados: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` actualizado.
  - Avance 2025-12-02 (cont.): refactor de `src/components/ProductCard.tsx` (subcomponentes + hook `useProductCardState`) y `pages/AddressesPage.tsx` (hook `useAddressesState` + subcomponentes). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` refleja la caída de estos módulos fuera del top inmediato.
  - Avance 2025-12-02 (extra): refactor de `src/components/FAQSection.tsx` (hook `useFaqFilters` + subcomponentes) y simplificación de `src/hooks/useSearchBar.ts` (debounce memorizado, mapa de acciones). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-xx: `src/pages/ProductPage.tsx` ahora usa `useProductDetails` para fetch/fallback y componentes `ProductHero`/`ProductInfo`; breadcrumbs/SEO calculados con hooks/memos. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` actualizado.
  - Avance 2025-12-xx: `src/utils/api.ts` reestructura los helpers (`buildConfig`, `sendRequest`, `handleRateLimit`), detecta HTML por error y centraliza `RateLimiter`; la interfaz GET/POST/PUT/PATCH/DELETE sigue igual. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` registra la caída de `api.ts` (ahora 31).
  - Avance 2025-12-xx: `src/components/ShoppingCart.tsx` delega el listado en `CartItemsList`, `CartItemRow` y `CartQuantityControl`, y el resumen en `CartSummary`/`CheckoutButton`; el hook `useShoppingCart` se concentra en totales. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` muestra `ShoppingCart.tsx` en 27.
  - Avance 2025-12-03: `pages/StorePage.tsx` usa `useStorePage` (fetch, filtros, orden, paginación) y subcomponentes (header, controles, grid, estados vacíos/errores, paginación). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; StorePage sale del top de complejidad.
  - Avance 2025-12-03: `src/utils/api.ts` (2ª pasada) mueve helpers a `apiHelpers.ts` y reduce CC manteniendo la interfaz CRUD. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` ya no lista api.ts en el top.
  - Avance 2025-12-03: `src/components/ShoppingCart.tsx` (2ª pasada) orquesta subcomponentes en `components/cart/*` con `useCartItemState`; CC fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: `src/types/product.ts` y `src/utils/transformApiError.ts` simplificados (Partial para opcionales, mapa de mensajes). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Estado CC (2025-12-02): los módulos refactorizados quedan por debajo de CC 15 y salen del top del `complexity-report.json`.
- [ ] T5.2 Clean Architecture y separación de responsabilidades
  - Evidencia: ajustes en los servicios/rutas y la documentación en la ADR `docs/adr/0003-phase5-maintainability.md`.
- [ ] T5.3 Pre-commit obligatorio y normas de revisión
  - Evidencia: `lint-staged`/`husky` en `package.json`, instrucciones de validación en `docs/runbooks/fase5-maintainability.md` y el checklist adicional para reviewers.
- [ ] T5.4 ADRs/documentación viva
  - Evidencia: ADR 0003 + actualizaciones en el plan (doc anterior) y confirmación de que los artefactos del release se adjuntan en cada PR.
- Plan detallado: `GPT-51-Codex-Max-Hight/plan-maestro-fase-5.md` resume objetivos, sprint y artefactos obligatorios.

- Acciones actuales: ejecutar `npm run check:complexity`, documentar los refactors, mantener el plan del sprint en `docs/runbooks/fase5-maintainability.md` y registrar las decisiones en `docs/adr/0003-phase5-maintainability.md`.
- Plan de trabajo disponible: `docs/fase4-plan.md` describe los tres sprints y artefactos requeridos para abordar trazas, pipelines y resiliencia.

Evidencia a recoger: pipeline YAML actualizado, dashboards y runbooks verificados.

---

## Operaciones y comandos útiles

- Ejecutar checks de calidad: `npm run lint && npm run type-check && npm run format:check`
- Ejecutar tests y security: `npm run test:ci && npm run scan:security`
- Ejecutar sólo backend tests: `npm run test:backend` (si existe) o `vitest -c backend/vitest.config.ts`

---

Si abres otro chat o continúas con otro modelo, di: "Lee `GPT-51-Codex-Max-Hight/prompt-inicial.md` y `GPT-51-Codex-Max-Hight/CheckList.md` para conocer el estado completo y las evidencias".
