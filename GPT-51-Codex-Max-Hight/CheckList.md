# CheckList - Seguimiento detallado del Plan Maestro (PuraNatura)

Este archivo centraliza el estado de avance (evidencias y acciones pendientes)
del Plan Maestro (`plan-maestro.md`). Cualquier agente o persona que lea
`prompt-inicial.md` debe también consultar este `CheckList.md` para conocer el
estado real y los artefactos de evidencia.

Última actualización: 2025-11-29

## Resumen rápido ✅
 - Fase 0 — Preparación y contención: COMPLETADA ✅ (evidencia: `docs/phase-checkpoints.md`, ejecución local de gates). 
 - Fase 1 — Seguridad & Estabilidad: EN PROGRESO ⚙️ (hardening aplicado; CI/seguridad reforzada; pasos de gestión de secretos y limpieza de integraciones LLM completados en parte).
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

## Fase 1 — Seguridad & Estabilidad (Estado: EN PROGRESO) ⚙️

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
 - [ ] T1.4 Secret management (Vault/GH-Secrets) — EN PROGRESO
  - Status: migration scaffolding in place. CI guard added to block accidental tracked env files and a required-secrets manifest + validation workflow were added to check required runtime secrets.
  - New automation/tools added: `scripts/list-required-secrets.cjs`, `scripts/gh-set-secrets.cjs`, `scripts/deploy-check.cjs`, `.github/workflows/deploy-check-secrets.yml`.
  - Next: create the actual GH Secrets (organization or repo) and verify pipeline accesses (Vault or GH Secrets). Evidence: `docs/secrets-migration.md`, `.github/workflows/block-env-files.yml`, `.github/required-secrets.yml`, `.github/workflows/validate-required-secrets.yml`, `.github/workflows/deploy-check-secrets.yml`.
 - [x] T1.5 Seguridad de IA — endpoint retired / removed
  - Status: el endpoint integrado de IA (`/api/ai`) y las integraciones directas con proveedores LLM fueron retiradas (2025-11-29). Todas las referencias explícitas a claves de proveedor (p. ej. `OPENAI_API_KEY`, `GEMINI_API_KEY`) fueron eliminadas de los manifiestos y la documentación. Recomendamos integrar capacidades LLM a través de orquestadores externos (ej. n8n) y webhooks seguros.
- [x] T1.6 DAST/SAST — SAST integration (CodeQL) added
  - Status: SAST added + DAST added + Trivy FS scan added to CI.
  - Evidence:
    - SAST: `.github/workflows/codeql-analysis.yml`
    - DAST (OWASP ZAP baseline): `.github/workflows/dast-zap.yml`
    - Trivy (repo/fs scanning): `.github/workflows/trivy-scan.yml`
- [ ] T1.7 Supply chain attestation — TODO

### Evidencias y artefactos generados durante Fase 1
 - Codigo modificado: `backend/src/routes/auth.ts`, `backend/src/middleware/csrf.ts`, `backend/src/config/env.ts`.
 - Limpieza/configuración relacionada con LLM: `.env.example` neutralizado, `.github/required-secrets.yml` actualizado, `.github/workflows/deploy-check-secrets.yml` limpiado, múltiples docs y archivos `archive/` neutralizados/eliminados.
- Tests: `test/backend.auth.test.ts` (rate-limit tests), `npm run test:ci` green.
- CI: `ci-quality.yml` gate for quality; security scanners ran locally.

---

## Fase 2 — Datos, API y contratos (Estado: PENDIENTE)

- [ ] T2.1 OpenAPI 3.1 completo
- [ ] T2.2 Prisma: migraciones versionadas y estabilidad
- [ ] T2.3 Catálogo: paginación defensiva, ETag + cache
- [ ] T2.4 Seeds idempotentes y validaciones
- [ ] T2.5 Analytics endpoint con zod & rate-limit
- [ ] T2.6 Drift check OpenAPI ↔ implementaciones

Evidencia a recoger para cierre: `openapi.yaml` en repo, contract test logs (Prism/Dredd), Prisma migration files aplicadas en stage.

---

## Fase 3 — Frontend UX, A11y y Performance (Estado: PENDIENTE)

- [ ] T3.1 Focus trap/escape en modales y accessibility fixes
- [ ] T3.2 Code splitting y lazy-loading
- [ ] T3.3 Optimización de imágenes
- [ ] T3.4 A11y (axe-playwright) cumplimiento
- [ ] T3.5 Performance web (LHCI) optimizado

Evidencia a recoger: LHCI reports, axe reports, bundle size report.

---

## Fase 4 — Observabilidad, CI/CD y Resiliencia (Estado: PENDIENTE)

- [ ] T4.1 Tracing/logging con OpenTelemetry y traceId en headers
- [ ] T4.2 Métricas y dashboards (Prometheus/Grafana)
- [ ] T4.3 Pipeline completo y canary releases
- [ ] T4.4 Feature flags + canary automation
- [ ] T4.5 Backups/DR tests
- [ ] T4.6 Synthetic monitoring

Evidencia a recoger: pipeline YAML actualizado, dashboards y runbooks verificados.

---

## Fase 5 — Refactor, deuda y prevención (Estado: PENDIENTE)

- [ ] T5.1 Reducir CC y deuda técnica
- [ ] T5.2 Clean Architecture y separación de responsabilidades
- [ ] T5.3 Pre-commit obligatorio y normas de revisión
- [ ] T5.4 ADRs/documentación viva

---

## Operaciones y comandos útiles
- Ejecutar checks de calidad: `npm run lint && npm run type-check && npm run format:check`
- Ejecutar tests y security: `npm run test:ci && npm run scan:security`
- Ejecutar sólo backend tests: `npm run test:backend` (si existe) o `vitest -c backend/vitest.config.ts`

---

Si abres otro chat o continúas con otro modelo, di: "Lee `GPT-51-Codex-Max-Hight/prompt-inicial.md` y `GPT-51-Codex-Max-Hight/CheckList.md` para conocer el estado completo y las evidencias".
