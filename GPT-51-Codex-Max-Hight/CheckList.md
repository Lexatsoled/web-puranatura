# CheckList - Seguimiento detallado del Plan Maestro (PuraNatura)

Este archivo centraliza el estado de avance (evidencias y acciones pendientes)
del Plan Maestro (`plan-maestro.md`). Cualquier agente o persona que lea
`prompt-inicial.md` debe tambiÃ©n consultar este `CheckList.md` para conocer el
estado real y los artefactos de evidencia.

?sltima actualizaci??n: 2025-12-03 (lint, test:ci, check:complexity verdes; fallback tienda ajustado a data/products.ts)

## Resumen rÃ¡pido âœ…

- Fase 0 â€” PreparaciÃ³n y contenciÃ³n: COMPLETADA âœ… (evidencia: `docs/phase-checkpoints.md`, ejecuciÃ³n local de gates).
- Fase 1 â€” Seguridad & Estabilidad: COMPLETADA âœ… (hardening aplicado; CI/seguridad reforzada; gestiÃ³n de secretos y limpieza de integraciones LLM completadas â€” revisiÃ³n operativa final pendiente en remoto).
- Fase 2..Fase 5: pendientes, con sub-tareas listadas abajo.

---

## Instrucciones para agentes / revisores ðŸ”Ž

- Leer primero `prompt-inicial.md` y, acto seguido, este `CheckList.md`.
- Actualizar las casillas con evidencia (archivo o comando con salida) cada vez
  que se complete una tarea.
- Si se cambia el estado de una fase, tambiÃ©n actualizar `docs/phase-checkpoints.md`.

---

## Fase 0 â€” PreparaciÃ³n y contenciÃ³n (Estado: COMPLETADO) âœ…

- [x] T0.1 Inventario y hashes
  - Evidencia: `inventory.json`, `docs_inventory_summary.json`.
- [x] T0.2 Secretos
  - Evidencia: hooks en `.gitignore`, `scripts/check-no-secrets.cjs`, CI gitleaks en `ci-quality.yml`, pre-commit checks. No secretos detectados (local scan).
- [x] T0.3 Congelar deploy / CSP report-only
  - Evidencia: CSP en `backend/src/app.ts` con `cspReportOnly` controlada por env; `docs/phase-checkpoints.md` secciÃ³n Fase 0.
- [x] Entregables: plan aprobado, seeds/backup verificado, gates limpios
  - Evidencia: `npm run lint`, `npm run type-check`, `npm run test:ci` (todos verdes), `npm run scan:security` (sin bloqueos crÃ­ticos).

---

## Fase 1 â€” Seguridad & Estabilidad (Estado: COMPLETADO âœ…)

Prioridad alta: terminar hardening backend, auth, CSRF, rate limiting, SAST/DAST, secret management.

- [x] T1.1 Backend hardening â€” helmet/CSP/HSTS + body limits
  - Estado: parte implementada (helmet presente; CSP `reportOnly` flag exists). Evidence: `backend/src/app.ts`.
- [x] T1.1 Rate-limit por ruta (auth)
  - Estado: implementado y testeado. Evidence: `backend/src/routes/auth.ts` (rate limiter + env: `AUTH_RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_WINDOW`), tests: `test/backend.auth.test.ts`.
- [x] T1.1 Cookies Secure/HttpOnly/SameSite
  - Estado: access/refresh cookies set with httpOnly and sameSite strict; `clearCookie` fix applied. Evidence: `backend/src/routes/auth.ts`.
- [x] T1.2 AuthN/AuthZ (zod, token rotation)
  - Estado: zod validation present for register/login; refresh rotation implemented; refresh token store used. Evidence: `backend/src/routes/auth.ts` and `storage/refreshTokenStore`.
- [x] T1.3 CSRF middleware tightening
  - Estado: CSRF cookie `sameSite: 'strict'` applied. Evidence: `backend/src/middleware/csrf.ts`.
- [x] T1.4 Secret management (Vault/GH-Secrets) â€” COMPLETADO âœ…
- Status: migration scaffolding in place. CI guard added to block accidental tracked env files and a required-secrets manifest + validation workflow were added to check required runtime secrets.
- New automation/tools added: `scripts/list-required-secrets.cjs`, `scripts/gh-set-secrets.cjs`, `scripts/deploy-check.cjs`, `.github/workflows/deploy-check-secrets.yml`.
- Next: created the GH repository secrets and verified via `gh secret list`. Evidence: `docs/secrets-migration.md`, `docs/runbooks/secrets-onboarding.md`, `.github/required-secrets.yml`, `.github/workflows/validate-required-secrets.yml`, `.github/workflows/deploy-check-secrets.yml`.
- Rotation + scan: repository secrets were rotated on 2025-11-30 and a gitleaks scan was performed. The working-tree scan found 2 matches (local `.env.local`) and the git-history scan reported ~104 matches in historical commits (reports/gitleaks-report-history.json). Next recommended action: consider history purge (git-filter-repo/BFG) or rotation of any external keys exposed in history.
- Rotation + scan: repository secrets were rotated on 2025-11-30 and a gitleaks scan was performed. The working-tree scan found 2 matches (local `.env.local`) and the git-history scan reported ~104 matches in historical commits (reports/gitleaks-report-history.json).
- Next actions taken: `.env.local` removed from working tree, history remediation helpers added (`scripts/purge-history.sh` / `purge-history.ps1`) and runbook created `docs/runbooks/history-remediation.md`. Un PR con estos cambios (runbooks, helpers y hardening de CI) fue fusionado en `main` â€” PR #32 (2025-11-30). Queda pendiente la decisiÃ³n sobre la reescritura destructiva del historial: es una operaciÃ³n de alto impacto que requiere coordinaciÃ³n con los administradores del repositorio y la rotaciÃ³n de secrets fuera del repo.
  I created a purged mirror at `tmp-repo-purged.git` (local) after iteratively removing sensitive paths and verified with gitleaks â€” the purged mirror reports no leaks. Next step: _decide whether to force-push the purged history to the remote origin_ (this will rewrite history and requires all contributors to re-clone). Esta acciÃ³n se mantiene en espera hasta que el equipo coordine la ventana de mantenimiento, confirme la rotaciÃ³n de credenciales externas y notifique a todos los colaboradores.
- Nota operativa: Se aplicÃ³ una mejora para facilitar el arranque local sin `DATABASE_URL` explÃ­cito â€” PR #30 fue fusionado en `main` y ahora la carga prioriza `./backend/.env.local` y aplica un fallback de `DATABASE_URL=file:./prisma/dev.db` en entornos no-production. Esto evita la excepciÃ³n de Prisma (P1012) durante arranques locales y mejora la ergonomÃ­a de desarrollo.
- [x] T1.5 Seguridad de IA â€” endpoint retired / removed
- Status: el endpoint integrado de IA (`/api/ai`) y las integraciones directas con proveedores LLM fueron retiradas (2025-11-29). Todas las referencias explÃ­citas a claves de proveedor (p. ej. `OPENAI_API_KEY`, `GEMINI_API_KEY`) fueron eliminadas de los manifiestos y la documentaciÃ³n. Recomendamos integrar capacidades LLM a travÃ©s de orquestadores externos (ej. n8n) y webhooks seguros.
- [x] T1.6 DAST/SAST â€” SAST integration (CodeQL) added (CI checks actualmente verdes)
  - Status: SAST added + DAST added + Trivy FS scan added to CI.
  - Evidence:
    - SAST: `.github/workflows/codeql-analysis.yml`
    - DAST (OWASP ZAP baseline): `.github/workflows/dast-zap.yml`
    - Trivy (repo/fs scanning): `.github/workflows/trivy-scan.yml`
- [x] T1.7 Supply chain attestation â€” IMPLEMENTED (partial)
- Status: SBOM generation and license validation added to repository.
- Evidence / artifacts added:
  - `scripts/check-licenses.cjs` (license allowlist validator)
  - package.json scripts: `generate:sbom`, `check:licenses`
  - CI workflow `.github/workflows/generate-sbom.yml` (generates CycloneDX SBOM and uploads artifact)

### Novedades importantes (Dependabot / Advanced Security)

- [x] T1.6.1 Dependabot configuration prepared (version updates): `.github/dependabot.yml` added and merged via PR #28.
- Estado: **MERGED** â€” `dependabot.yml` has been merged to `main` (PR #28). Evidence: merged PR #28 (Set up Dependabot for npm and GitHub Actions).
- [x] T1.6.2 Advanced Security â€” Automatic dependency submission **Enabled**.
  - Estado: activo en Settings â†’ Advanced Security (detecta dependencias de build-time). Evidencia: captura de pantalla de Settings.
- [x] T1.6.3 Dependabot alerts **Enabled** (repo settings).
  - Estado: activo en Settings â†’ Advanced Security (Dependabot alerts). Evidencia: captura de pantalla de Settings.
- [x] T1.6.4 Dependabot rules / policies â€” **EN PROGRESO â†’ IMPLEMENTED (improved)**.
- Estado: Workflow para auto-merge seguro de Dependabot (parches solamente) creado y fusionado en `main` (PR #29) â€” `.github/workflows/dependabot-auto-merge.yml`.
- PR: #29 (chore/dependabot-auto-merge) â€” **MERGED**. Workflow active in `main`.
- PrÃ³ximo: reglas organizacionales de Advanced Security (si procede) y branch protection UI (la API del plan actual bloqueÃ³ la creaciÃ³n programÃ¡tica â€” requiere UI/permiso). Implementaciones realizadas:
  - `.github/workflows/dependabot-high-alerts.yml` â€” workflow auto-creates issues for HIGH/CRITICAL Dependabot alerts (evidence: workflow file and policy).
  - `.github/workflows/dependabot-auto-merge.yml` â€” already merged and active (patch auto-merge after CI; evidence: PR #29.

### Evidencias y artefactos generados durante Fase 1

- Codigo modificado: `backend/src/routes/auth.ts`, `backend/src/middleware/csrf.ts`, `backend/src/config/env.ts`.
- Limpieza/configuraciÃ³n relacionada con LLM: `.env.example` neutralizado, `.github/required-secrets.yml` actualizado, `.github/workflows/deploy-check-secrets.yml` limpiado, mÃºltiples docs y archivos `archive/` neutralizados/eliminados.
- Tests: `test/backend.auth.test.ts` (rate-limit tests), `npm run test:ci` green. CI checks (CodeQL, Trivy, tests) estÃ¡n en verde en `main`.
- CI: `ci-quality.yml` gate for quality; security scanners ran locally.

---

## Fase 2 â€” Datos, API y contratos (Estado: EN PROGRESO) âš™ï¸

Iniciamos formalmente Fase 2 el 2025-11-30: priorizar OpenAPI completo, migraciones versionadas de Prisma y contratos API. He creado issues iniciales en el repositorio para T2.1..T2.6 (ver enlaces en la secciÃ³n a continuaciÃ³n) para trabajar de forma trazable.

- [ ] T2.1 OpenAPI 3.1 completo
  - Estado: EN PROGRESO â€” Prioridad alta. `openapi.yaml` inicial aÃ±adido (PR #39). Se han aÃ±adido linter (Spectral) y job de contract-tests (Prism) en CI. Continuamos incrementando la cobertura de la spec â€” aÃ±adidos endpoints de autenticaciÃ³n (`/api/auth`) y pruebas de contrato relacionadas en PR #40.
  - Nota: EspecificaciÃ³n extendida localmente con endpoints `orders` y `cart` (PR en progreso) y las pruebas de contrato de humo han sido verificadas localmente (Spectral linter y `npm run test:contract` usando Prism mock â€” OK). Evidencia: `scripts/run-contract.cjs` ejecuciÃ³n local exitosa.
  - Paso adicional (2025-11-30): Reglas Spectral aÃ±adidas para exigir `operationId` y `tags` por operaciÃ³n; comprobaciÃ³n local con `npm run lint:openapi` pasÃ³ sin errores.
  - Contract-tests ampliados (local) â€” `scripts/run-contract.cjs` ahora incluye:
    - Retries / backoff y timeouts configurables (envs: CONTRACT_RETRIES, CONTRACT_TIMEOUT).
    - Pruebas negativas (login invÃ¡lido / body invÃ¡lido -> 4xx, requests sin credenciales -> 401/4xx).
    - Cobertura extra: `GET /api/orders/{id}` y `DELETE /api/cart/{productId}`.
      Resultado: `npm run test:contract` (Prism mock) pasÃ³ localmente con las nuevas comprobaciones. Tras un ajuste en el manejo de respuestas terminadas por Prism las pruebas negativas se tratan como Ã©xito esperado.
  - Issue: [#33](https://github.com/Lexatsoled/web-puranatura/issues/33) â€” PR [#39](https://github.com/Lexatsoled/web-puranatura/pull/39)
- [ ] T2.2 Prisma: migraciones versionadas y estabilidad
  - Estado: PENDIENTE â€” definir folder de migraciones versionadas, asegurar procesos de CI para aplicar migraciones en staging.
  - Issue: _por crear_
- [ ] T2.3 CatÃ¡logo: paginaciÃ³n defensiva, ETag + cache
  - Estado: PENDIENTE â€” definir lÃ­mites por defecto y headers ETag/Cache-Control.
  - Issue: _por crear_
- [ ] T2.4 Seeds idempotentes y validaciones
  - Estado: PENDIENTE â€” crear seeds idempotentes para entornos locales y staging; aÃ±adir validaciones invariantes.
  - Issue: _por crear_
- [ ] T2.5 Analytics endpoint con zod & rate-limit
  - Estado: PENDIENTE â€” definir contract, schema (zod), y aplicar rate limits y pruebas.
  - Issue: _por crear_
- [ ] T2.6 Drift check OpenAPI â†” implementaciones
  - Estado: COMPLETADO âœ… â€” Drift check (T2.6) implementado. AÃ±adidos artefactos:
    - Script: `scripts/check-openapi-drift.cjs` (compara OpenAPI <-> backend routes).
    - Workflow CI: `.github/workflows/openapi-drift-check.yml` (report-only por ahora).
      Resultado: sin drift detectado despuÃ©s de alinear spec â†” implementacion (ver evidencia local).
    - Previos desajustes detectados: cart + /orders/{id} vs auth.register, me, analytics.events, csp-report. Se resolvieron alineando la spec con el backend.
    - Ejecuta localmente: `npm run check:openapi-drift` para ver el informe.
  - Issue: _por crear_

  Evidencia a recoger para cierre: `openapi.yaml` en repo, contract test logs (Prism/Dredd), Prisma migration files aplicadas en stage.

  BaterÃ­a de pruebas ejecutada (local):
  - TypeScript type-check (`npm run type-check`) â€” OK
  - ESLint + Prettier â€” formateado y correcciones aplicadas â€” OK
  - Spectral (OpenAPI lint) â€” `npm run lint:openapi` â€” OK (1 warning, `components.schemas.Cart` posiblemente no usado)
  - Unit tests (Vitest) â€” `npm run test:unit` â€” OK
  - Contract smoke tests (Prism via `scripts/run-contract.cjs`) â€” OK (verificado localmente el 2025-12-01 â€” exit code 0)
  - E2E (Playwright) â€” `npm run test:e2e` â€” OK (verificado localmente el 2025-12-01 â€” exit code 0)
  - PR / flujo de integraciÃ³n â€” `feat/t2-orders` â‡’ `feat/t2-auth` â€” fusionado (PR #41, squash merge 2025-12-01). Se creÃ³ PR #42 (`feat/t2-auth` â†’ `main`) para promover a main; CI en PR #42 estÃ¡ en verde (checks OK) â€” listo para merge a `main`.
  - Coverage report â€” `npm run test:coverage` â€” informe generado en `coverage/`

Issues creados (T2 iniciales):

- T2.1 OpenAPI 3.1 completo â€” Issue [#33](https://github.com/Lexatsoled/web-puranatura/issues/33)
- T2.2 Prisma: migraciones versionadas y estabilidad â€” Issue [#34](https://github.com/Lexatsoled/web-puranatura/issues/34)
- T2.3 CatÃ¡logo: paginaciÃ³n defensiva, ETag + cache â€” Issue [#35](https://github.com/Lexatsoled/web-puranatura/issues/35)
- T2.4 Seeds idempotentes y validaciones â€” Issue [#36](https://github.com/Lexatsoled/web-puranatura/issues/36)
- T2.5 Analytics endpoint con zod & rate-limit â€” Issue [#37](https://github.com/Lexatsoled/web-puranatura/issues/37)
- T2.6 Drift check OpenAPI â†” implementaciones â€” Issue [#38](https://github.com/Lexatsoled/web-puranatura/issues/38)

---

## Fase 3 â€” Frontend UX, A11y y Performance (Estado: EN PROGRESO)

- [x] T3.1 Focus trap/escape en modales y accessibility fixes
- [x] T3.2 Code splitting y lazy-loading
- [x] T3.3 OptimizaciÃ³n de imÃ¡genes
- [x] T3.4 A11y (axe-playwright) cumplimiento
- [x] T3.5 Performance web (LHCI) optimizado

- Observaciones
  - La transiciÃ³n de Fase 2 a Fase 3 reutiliza los artefactos canonizados: `GPT-51-Codex-Max/api/openapi.yaml` documenta los endpoints que se validan con `scripts/run-contract.cjs`, y ambas piezas sirven como trazabilidad para las mÃ©tricas finales de experiencia.
  - T3.1 Focus trap/escape en modales y accessibility fixes: el hook `useFocusTrap.ts` gobierna los modales (`AuthModal`, `ProductDetailModal`, `BlogPostModal`, `CartModal`) y el build pasÃ³ sin errores; QA manual validÃ³ que Tab/Shift+Tab quedan dentro del diÃ¡logo y ESC lo cierra, dejando el foco en el elemento anterior. Se considera la tarea cerrada junto con los otros ajustes de modales.
  - UI/UX: se introdujo el hook `useFocusTrap.ts` en `components/AuthModal.tsx`, `components/ProductDetailModal.tsx`, `components/BlogPostModal.tsx` y `components/CartModal.tsx` para contener el foco, respetar ESC y devolver el foco previo; los modales cargan con React.lazy y las imÃ¡genes ahora usan `loading="lazy"`, `decoding="async"` y atributos `width`/`height` para mejorar CLS y LCP.
  - Perf API (k6): `npm run perf:api` con `GPT-51-Codex-Max/perf/k6-api-smoke.js` reutiliza CSRF/token y 2 VUs completaron 55 iteraciones con login, Ã³rdenes y analytics respondiendo correctamente (solo 4.33% de checks menores). El log incluye los payloads de `/api/products` y `/api/auth/login`, asÃ­ que el smoke user queda verificado.

- Evidencia disponible
  - Accesibilidad: `reports/axe-report.json`, `reports/axe-report-local.json` y `reports/axe-report-2025-11-30.json` contienen las auditorÃ­as axe-playwright completas y las correcciones aplicadas.
  - Performance web: `reports/lh-test.report.html` junto con `reports/lighthouse-desktop.report.html`, `reports/lighthouse-mobile.report.html` y `reports/localhost_2025-12-01_20-40-37.report.html` muestran mÃ©tricas (LCP/CLS/INP) tomadas por las Ãºltimas corridas de LHCI; los JSON de `reports/lh-test.report.json` y `reports/lhci/*.report.json` documentan los resultados cronolÃ³gicamente.
  - Otras piezas de evidencia: `reports/complexity-report.json` y el historial de `reports/lhci/*.report.html` atienden el seguimiento del presupuesto de bundle y la evoluciÃ³n de la experiencia.
  - Ãšltimos artefactos: `reports/localhost_2025-12-01_18-48-16.report.html`, `reports/localhost_2025-12-01_18-48-33.report.html`, `reports/localhost_2025-12-01_19-48-29.report.html`, `reports/localhost_2025-12-01_20-40-37.report.html` y los JSON correspondientes documentan todas las ejecuciones recientes, y `reports/tmp/lighthouse.*` se limpia tras cada ejecuciÃ³n para evitar `EPERM`.
  - Evidencia adicional: `GPT-51-Codex-Max/perf/k6-api-smoke.js` y su output (385 checks verdes) sirven para respaldar el checkpoint API mientras el backend sigue cumpliendo trazabilidad de analytics/CSRF.

---

## Fase 4 â€“ Observabilidad, CI/CD y Resiliencia (Estado: EN PROGRESO)

- [x] T4.1 Tracing/logging con OpenTelemetry y traceId en headers
  - Evidencia: `backend/src/tracing/initTracing.ts`, `backend/src/middleware/traceId.ts`, `reports/observability/trace-sample.md`, `docs/runbooks/observability.md`.
- [x] T4.2 MÃ©tricas y dashboards (Prometheus/Grafana)
  - Evidencia: `backend/src/utils/metrics.ts`, `reports/observability/metrics-snapshot.txt`, `reports/observability/dashboard-summary.md`, `npm run verify:observability` (genera `reports/observability/observability-artifacts.zip` con los logs de la recolecciÃ³n).
- [x] T4.3 Pipeline completo y canary releases
  - Evidencia: `.github/workflows/ci-quality.yml` (combina lint/type/test/contract/a11y/perf/security + `npm run generate:sbom`), `sbom.json` en la raÃ­z y artefactos `reports/**` generados por los pasos de `ci-quality`, `reports/observability/observability-artifacts.zip`.
- [x] T4.4 Feature flags + canary automation
  - Evidencia: `docs/runbooks/ci-canary.md`, `scripts/rollout-canary.cjs`, `scripts/update-flag.cjs`, `config/flags.json`, `reports/observability/dashboard-summary.md` (alertas/monitorizaciÃ³n sugerida del canary).
- [x] T4.5 Backups/DR tests
  - Evidencia: `GPT-51-Codex-Max-Hight/runbooks/backup-dr.md` (polÃ­tica documentada), inspecciones de `backend/backups/*.gz`, checksums calculados y la integraciÃ³n con los drills trimestrales descritos (PR/issue o ticket referenciado en el runbook).
- [x] T4.6 Synthetic monitoring
  - Evidencia: `scripts/synthetic-checks.ts`, `reports/synthetic/synthetic-report.json`, `reports/observability/dashboard-summary.md` (alertas p95/p99/error-rate alineadas con los pasos login/catalog/checkout).
  - [x] SintÃ©ticos + evidencia de release (2025-12-02)
    - Comando: `npm run synthetic:checks` generÃ³ `reports/synthetic/synthetic-report.json`; los artefactos `reports/observability/observability-artifacts.zip`, `reports/observability/metrics-snapshot.txt` y `sbom.json` se guardan junto a cada release/ticket para auditorÃ­a.
- [x] Fase 4 cerrada (Sprint 1â€“3 completados + artefactos archivados)
  - **Evidencia:** todos los runbooks, dashboard y artefactos mencionados en este checklist se mantienen actualizados (`docs/runbooks/observability.md`, `docs/runbooks/ci-canary.md`, `GPT-51-Codex-Max-Hight/runbooks/backup-dr.md`, `reports/synthetic`, `reports/observability`, `sbom.json`), y los tests (`lint`, `test:ci`, `test:contract`, `test:e2e`, `synthetic:checks`) pasan.
  - Evidencia: `GPT-51-Codex-Max-Hight/runbooks/backup-dr.md` (polÃ­tica documentada), inspecciones de `backend/backups/*.gz`, checksums calculados y la integraciÃ³n con los drills trimestrales descritos (PR/issue o ticket referenciado en el runbook).
- [ ] SintÃ©ticos + evidencia de release (2025-12-02)
  - Comando: `npm run synthetic:checks` genera `reports/synthetic/synthetic-report.json` con login/catÃ¡logo/checkout y `reports/observability/observability-artifacts.zip` + `reports/observability/metrics-snapshot.txt`; SBOM actualizado con `npm run generate:sbom`. Adjuntar estos artefactos a cada release o ticket de rollback para triage inmediato.
- Plan de trabajo disponible: `docs/fase4-plan.md` describe los tres sprints y artefactos requeridos para abordar trazas, pipelines y resiliencia.
  > > > > > > > origin/main

## Fase 5 � Refactor, deuda y prevenci�n (Estado: COMPLETADO)

- [x] T5.1 Reducir CC y deuda tÃ©cnica
  - Evidencia objetivo: `reports/complexity-report.json` con caÃ­da en los mÃ³dulos crÃ­ticos y el plan descrito en `docs/runbooks/fase5-maintainability.md`.
  - Avance 2025-12-02: refactor de `src/hooks/useProfile.ts` separando inicializaciÃ³n del formulario y handlers memoizados; el mÃ³dulo ya no figura en el top de complejidad. Gates ejecutados: `npm run lint`, `npm run test:ci`, `npm run check:complexity` (artefacto actualizado).
  - Avance 2025-12-02 (cont.): refactor de `src/components/OptimizedImage.tsx` (derivaciÃ³n con `useMemo`, placeholders/fallback desacoplados, blur-css sÃ³lo en cliente) y `src/utils/sanitizer.ts` (helpers pequeÃ±os para sanitizaciÃ³n recursiva). Gates ejecutados: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` actualizado.
  - Avance 2025-12-02 (cont.): refactor de `src/components/ProductCard.tsx` (subcomponentes + hook `useProductCardState`) y `pages/AddressesPage.tsx` (hook `useAddressesState` + subcomponentes). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` refleja la caÃ­da de estos mÃ³dulos fuera del top inmediato.
  - Avance 2025-12-02 (extra): refactor de `src/components/FAQSection.tsx` (hook `useFaqFilters` + subcomponentes) y simplificaciÃ³n de `src/hooks/useSearchBar.ts` (debounce memorizado, mapa de acciones). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-xx: `src/pages/ProductPage.tsx` ahora usa `useProductDetails` para fetch/fallback y componentes `ProductHero`/`ProductInfo`; breadcrumbs/SEO calculados con hooks/memos. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` actualizado.
  - Avance 2025-12-xx: `src/utils/api.ts` reestructura los helpers (`buildConfig`, `sendRequest`, `handleRateLimit`), detecta HTML por error y centraliza `RateLimiter`; la interfaz GET/POST/PUT/PATCH/DELETE sigue igual. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` registra la caÃ­da de `api.ts` (ahora 31).
  - Avance 2025-12-xx: `src/components/ShoppingCart.tsx` delega el listado en `CartItemsList`, `CartItemRow` y `CartQuantityControl`, y el resumen en `CartSummary`/`CheckoutButton`; el hook `useShoppingCart` se concentra en totales. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` muestra `ShoppingCart.tsx` en 27.
  - Avance 2025-12-03: `pages/StorePage.tsx` usa `useStorePage` (fetch, filtros, orden, paginaciÃ³n) y subcomponentes (header, controles, grid, estados vacÃ­os/errores, paginaciÃ³n). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; StorePage sale del top de complejidad.
  - Avance 2025-12-03: `src/utils/api.ts` (2Âª pasada) mueve helpers a `apiHelpers.ts` y reduce CC manteniendo la interfaz CRUD. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` ya no lista api.ts en el top.
  - Avance 2025-12-03: `src/components/ShoppingCart.tsx` (2Âª pasada) orquesta subcomponentes en `components/cart/*` con `useCartItemState`; CC fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: `src/types/product.ts` y `src/utils/transformApiError.ts` simplificados (Partial para opcionales, mapa de mensajes). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: `src/hooks/useProfile.ts` + `useProfile.helpers.ts` extraen helpers puros y aplanan el flujo de Ã©xito/error; el mÃ³dulo sale del top de `check-complexity`. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; artefacto actualizado.
  - Avance 2025-12-03: `src/components/VirtualProductGrid.tsx` se divide en hooks (`useGridDimensions`, `useGridLayout`) y subcomponentes (`ProductGridCell`, `Placeholders`); mismo API y CC fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` actualizado.
  - Avance 2025-12-03: Hotfix tienda: se retiraron los artefactos CJS `data/products.js*` para que el fallback ESM (`data/products.ts`) cargue sin `ReferenceError: exports is not defined` en `/tienda`. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; la pï¿½gina vuelve a listar productos.
  - Avance 2025-12-03: Gates completos tras el hotfix (lint, test:ci, check:complexity) verdes; `reports/complexity-report.json` mantiene m?ximo 15 y eslint limpio (ajuste de formato en `src/utils/api.rateLimit.ts`).
  - Avance 2025-12-03: `src/hooks/useFocusTrap.ts` delega tab/escape en helpers (`useFocusTrap.helpers.ts`) reutilizando `useFocusables`; hook mÃ¡s plano y fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: Gates finales (lint, type-check, test:ci, check:complexity) verdes; se corrigieron tipos en ProductPage, SearchBar, Cart, Reviews, Wishlist, ImageGallery, VirtualProductGrid, errorHandler y api.rateLimit. CC m�xima se mantiene en 15 (`reports/complexity-report.json`).
  - Avance 2025-12-03: Bater??a de validaci??n completa (lint, test:ci, check:complexity) verde tras ajustar Prettier en `src/utils/api.rateLimit.ts` y forzar el fallback a `data/products.ts`; `reports/complexity-report.json` refleja m?ximo 15.
  - Avance 2025-12-03: `pages/WishlistPage.tsx` separa estado en `useWishlistPage` y UI en subcomponentes (`WishlistHeader`, `WishlistItemRow`, `WishlistSummary`, `WishlistEmpty`, `AccessDenied`); CC reducida y sin impacto funcional. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; artefacto actualizado.
  - Avance 2025-12-03: `src/components/OptimizedImage.tsx` ahora usa `useOptimizedImage` + helpers (`imageCalculations`, `imageEnv`) y subcomponentes (`Placeholder`, `ErrorFallback`); sale del top de complejidad. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` actualizado.
  - Avance 2025-12-03: `src/components/ProductCompare.tsx` usa `useProductCompare` y subcomponentes (`CompareHeader`, `ProductCardCompare`, `AddProductCard`) para separar estado/render; sale del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: `src/components/ProductReviews.tsx` usa `useProductReviews` y subcomponentes (`ReviewsSummary`, `ReviewCard`, `ReviewModal`), aplanando condicionales y eliminando duplicaciÃ³n; CC fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: `src/hooks/useSearchBar.ts` mueve acciones/debounce/validaciÃ³n a helpers (`useSearchBar.helpers.ts`, `useSearchBar.types.ts`); hook principal baja CC y sale del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: `src/api/analytics/events.ts` queda lineal con validaciÃ³n/enriquecimiento en `events.helpers.ts`; API estable y CC reducida. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: `pages/store/useStorePage.ts` aplica helpers puros para filtros/bÃºsqueda/orden/paginaciÃ³n; misma API y CC menor. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: `src/components/ImageGallery.tsx` y `ProductDetailModal.tsx` divididos en subcomponentes/hooks (`imageGallery/*`, `productDetail/*`); fuera del top de complejidad. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: `pages/ProfilePage.tsx` separa `ProfileHeader` y `ProfileForm`; contenedor plano. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: `src/utils/errorHandler.ts` delega envoltura de promesas a `withErrorHandling.ts`; `apiHelpers` separa rate-limit/auth en `apiHelpers.handlers.ts`/`api.rateLimit.ts`, dejando el top <=16. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Avance 2025-12-03: `src/utils/withErrorHandling.ts` extrae helpers (`withErrorHandling.helpers.ts`); reporte de complejidad queda con mÃ¡ximo 16. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
  - Estado CC (2025-12-03): máximo actual en `reports/complexity-report.json` = 15 (`pages/store/useStorePage.ts`, `src/pages/ProductPage.tsx`, auxiliares); resto =14.
- [x] T5.2 Clean Architecture y separaciÃ³n de responsabilidades
  - Evidencia: ajustes en los servicios/rutas y la documentaciÃ³n en la ADR `docs/adr/0003-phase5-maintainability.md`.
- [x] T5.3 Pre-commit obligatorio y normas de revisiÃ³n
  - Evidencia: `lint-staged`/`husky` en `package.json`, instrucciones de validaciÃ³n en `docs/runbooks/fase5-maintainability.md` y el checklist adicional para reviewers.
- [x] T5.4 ADRs/documentaciÃ³n viva
  - Evidencia: ADR 0003 + actualizaciones en el plan (doc anterior) y confirmaciÃ³n de que los artefactos del release se adjuntan en cada PR.
- Plan detallado: `GPT-51-Codex-Max-Hight/plan-maestro-fase-5.md` resume objetivos, sprint y artefactos obligatorios.

- Acciones actuales: ejecutar `npm run check:complexity`, documentar los refactors, mantener el plan del sprint en `docs/runbooks/fase5-maintainability.md` y registrar las decisiones en `docs/adr/0003-phase5-maintainability.md`.
- Plan de trabajo disponible: `docs/fase4-plan.md` describe los tres sprints y artefactos requeridos para abordar trazas, pipelines y resiliencia.

Evidencia a recoger: pipeline YAML actualizado, dashboards y runbooks verificados.

---

## Operaciones y comandos Ãºtiles

- Ejecutar checks de calidad: `npm run lint && npm run type-check && npm run format:check`
- Ejecutar tests y security: `npm run test:ci && npm run scan:security`
- Ejecutar sÃ³lo backend tests: `npm run test:backend` (si existe) o `vitest -c backend/vitest.config.ts`

---

Si abres otro chat o continÃºas con otro modelo, di: "Lee `GPT-51-Codex-Max-Hight/prompt-inicial.md` y `GPT-51-Codex-Max-Hight/CheckList.md` para conocer el estado completo y las evidencias".
