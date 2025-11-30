# Prompt Inicial para IA Ejecutora (PuraNatura)

## Misión

- Ejecutar el plan enterprise de depuración/fortalecimiento de PuraNatura siguiendo `GPT-51-Codex-Max-Hight`.
- Objetivo: seguridad (0 high/critical), rendimiento (LCP <2.5s, API P95 <300ms), a11y ≥90, cobertura ≥85% (crítico 100%), despliegues sin downtime.

## Dónde está todo

- Roadmap y gates: `GPT-51-Codex-Max-Hight/plan-maestro.md`
- Calendario: `calendar.md`
- Roles/owners: `raci.md`
- SLO/SLA: `slo-sla.md`
- Métricas calidad: `quality-metrics.md`
- Versiones/herramientas: `tooling-versions.md`
- Trazabilidad hallazgos→tareas: sección en `plan-maestro.md`
- Checklists: `checklists/` (seguridad, code review, pre-commit, a11y, perf, rollout)
- Estado / seguimiento maestro: `CheckList.md` (archivo central para evidencias y checkpoints del Plan Maestro). **IMPORTANTE**: cuando abras `prompt-inicial.md` también lee `CheckList.md` para comprobar el estado actual y las pruebas/evidencias.
- Runbooks: `runbooks/` (incidentes, rollback, DR, perf-hotfix, oncall)
- Scripts: en `package.json` y `scripts/` (ver “Comandos clave” abajo)
- Datos/seed: `backend/prisma/seed.ts`
- Usuario smoke: `smoke@puranatura.test` / `SmokeP@ss123` (solo dev/stage)
- Comandos paso a paso: `executor-checklist.md`
- Ayuda rápida ante fallos: `faq-dificultades.md`

## Arquitectura (resumen rápido)

- Frontend: SPA Vite/React 19, contextos (Auth/Cart/Wishlist/Notifications) + Zustand, axios `useApi` con CSRF y sanitización (DOMPurify), lazy routes, fallback catálogo local.
- Backend: Express (helmet, rate-limit, cors, csrf double submit), rutas auth/products/orders/ai/analytics (pendiente), prom-client, traceId, logger simple, Prisma sobre SQLite (plan de migrar a Postgres).
- Observabilidad: /metrics Prometheus, traceId en headers/logs, LHCI y k6 en CI, GA/FB/Maps (CSP debe permitirlos).

## Fase actual

- Usa `plan-maestro.md` + `calendar.md` para saber la fase. Si no se especifica, comienza en Fase 0 (secretos/CSP report-only/backup).
- No avances de fase si los gates están rojos (ver plan-maestro).

## Comandos clave (en orden cuando aplique)

1. `npm run lint && npm run type-check && npm run format:check`
2. `npm run test:ci`
3. `npm run test:contract`
4. `npm run test:e2e`
5. `npm run a11y`
6. `npm run perf:api`
7. `npm run perf:web`
8. `npm run scan:security`
9. `npm run test:fuzz`
10. `npm run smoke` (post-deploy/local; requiere `BASE_URL`, `SMOKE_USER`, `SMOKE_PASS`)

Variables útiles:

- `BASE_URL` (default `http://127.0.0.1:3001`)
- `SMOKE_USER=smoke@puranatura.test`, `SMOKE_PASS=SmokeP@ss123`
- `FUZZ_ITERATIONS` (por defecto 50)

## Datos y seeds

- Ejecuta seeds antes de pruebas locales: `npx prisma db seed --schema=backend/prisma/schema.prisma` (o script equivalente).
- Usuario smoke se crea por seed; no usar en producción.

## Reglas de parada

- Detente si: vulnerabilidades high/critical, npm audit high>0, gitleaks con hallazgos, contract tests fallan, LCP >3s, API P95 >500ms, smoke falla.
- No merges si gates fallan (ver plan-maestro).

## Qué hacer ante dificultades

- Consulta `executor-checklist.md` para comandos exactos.
- Revisa checklists de seguridad/a11y/perf/rollout.
- Si un comando falla, registra el error y NO improvises cambios de código sin revisar hallazgos y plan.
- Usa runbooks para incidentes, rollback, DR o perf-hotfix.
- Actualiza `docs/phase-checkpoints.md` cada vez que completes una tarea, marcándola como OK y anotando la evidencia para mantener el estado de las fases al día.

## Salidas mínimas por fase (resumen)

- F0: secrets fuera del repo, claves rotadas, CSP report-only, backup probado.
- F1: CSP enforce lista, zod en rutas, IA segura, SAST/DAST limpios, SBOM/licencias OK.
- F2: OpenAPI completa y contract tests verdes, migraciones aplicadas, catálogo paginado/cache, analytics endpoint.
- F3: Lazy catálogo/modales, imágenes optimizadas, a11y sin “serious”, bundle <600kB, LHCI OK.
- F4: tracing/logs/métricas/alertas activas, CI/CD con canary + smoke, backups/DR verificados.
- F5: CC<10, MI verde, pre-commit obligatorio, ADRs actualizados.

## Recordatorios clave

- No subir secretos/DB; usar .env.example.
- CSP puede romper terceros: usar report-only primero, luego enforce detrás de flag.
- Siempre incluye traceId en logs/respuestas; sin PII ni claves.
- Mantén OpenAPI alineado (drift=0); publicar artefactos.
- Usa feature flags para cambios riesgosos; canary 5%-25%-50%-100% con rollback.
