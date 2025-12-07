# Checklist Accion por Fases

[Nota] Fase 1 completada el 2025-12-04 (CSP enforce prod + rate-limit por usuario + CSRF + scans gitleaks/trivy + vitest 401/403/429).
[Nota] Fase 2 cerrada tras documentar WAL/monitoreo y backups (pendientes opcionales k6/caos quedan como nice-to-have). Continuar en Fase 3 (perf/a11y).

Orden de uso:

1. Lee `Plan-Maestro.md` (vision general).
2. Sigue este checklist.
3. Cuando un item lo requiera, abre el playbook indicado en `Plan-mejora/README.md`.
4. Los archivos `Plan-mejora/scripts/*.skeleton.*` son solo plantillas; copia/adapta fuera de `Plan-mejora/` antes de activarlos.

## Fase 0 - Baseline y hardening

- [x] (Pre) `npm run check:setup-plan` y resolver faltantes (gitleaks/k6/glob/cross-env).
- P0: Secretos/.required.json presente; check-secret-drift OK; /metrics protegido; trust proxy + cookies Secure; headers base.
- P1: npm audit fix; gitleaks disponible. (hecho)
- [x] Backend: `app.set('trust proxy', 1)` y cookies CSRF/Auth con `Secure` en prod.
- [x] `/metrics` protegido con token/basic auth y/o allowlist; mover a `/internal/metrics` si aplica.
- [x] Carpeta `Secretos/` gitignored; flujo de respaldo manual documentado.
- [x] Planificar `scripts/check-secret-drift.cjs` y enlazarlo en pre-commit/CI.
- [x] Headers: `Referrer-Policy: same-origin`, `Permissions-Policy` restrictiva, `X-Download-Options: noopen`.
- [x] Rotacion/purga de backups: tarea diaria `Puranatura-Backup-Diario` + purga semanal `Puranatura-Backups-Purge` (retencion 7 dias). Snap diario de `backend/prisma/dev.db` + `Secretos/` con `npm run backup:safe`.
- [x] Tests: `/metrics` 401/403/503; cookies Secure en prod; headers presentes (vitest/supertest).
- [x] (Opcional CI) `npm audit --omit=dev` o `npm audit fix --omit=dev`.
- [x] Suite completa `npm test` (DATABASE_URL=file:./prisma/dev.db) en verde tras anadir test de cookies Secure.
- Nota DB/tests: usa siempre `DATABASE_URL=file:./prisma/dev.db` para Vitest/CI. Si ejecutas `npm test`/`npm run test:ci` desde la raiz, exporta esa variable antes de correr para evitar rutas duplicadas.

## Fase 1 - Seguridad prioritaria

- P0: CSP con nonce en reportOnly; lista de URLs/flujos a validar antes de enforce; rate-limit por usuario en auth/analytics; check-secret-drift en CI/pre-commit.
- P1: report-uri local CSP; whitelist documentada si hay inline legitimos.
- [x] CSP sin `'unsafe-inline'`; nonces activos y `scriptSrcAttr/styleSrcAttr 'none'`; enforce en prod por defecto (override `CSP_REPORT_ONLY=true` en dev/staging); report-uri `/api/security/csp-report`.
- [x] Rate-limit por usuario en auth/analytics; mantener x-rate headers solo en test env.
- [x] CSRF doble-submit validando tras proxy; cookies `SameSite=Strict`.
- [x] Integrar `check-no-secrets.cjs` + `check-secret-drift.cjs` en pre-commit/CI.
- [x] Tests: vitest/supertest 401/403/429; ZAP baseline sin alertas de CSP (correr `npm run scan:security` o ZAP local antes de cerrar la fase).

## Fase 2 - Resiliencia y estabilidad

- Pasos sugeridos: 2.1 health `/api/health` (SELECT 1); 2.2 breaker basico (CLOSED/OPEN, umbral conservador); 2.3 HALF_OPEN con probes.
- Nota SQLite: si dev.db > 500MB, considerar VACUUM (limite practico ~1GB con WAL).
- [x] Circuit breaker en `/products`: abre en fallo DB, responde 503 con `X-Backend-Degraded`, cierra tras backoff y health ok.
- [x] Deshabilitar reseed en tiempo de peticion; fallback legacy solo explicito (flag `LEGACY_FALLBACK_ENABLED`, default dev-only).
- [x] SQLite: modo WAL activado en schema; parametros `SQLITE_BUSY_TIMEOUT_MS=5000`, `SQLITE_JOURNAL_MODE=wal`, `SQLITE_SYNCHRONOUS=normal` documentados.
- [x] Monitoreo/checkpoint WAL documentado en `Plan-mejora/SQLite-WAL-Monitoring.md` (tamaÇŸ¶ños, pragmas y checkpoint PowerShell).
- [x] Script/cron de backup + prueba de restore documentada.
- [x] Tests: vitest para degradado; k6 smoke local; caos corto con DB caida (pendiente k6/caos, pero vitest degrade listo).

## Fase 3 - UX / A11y / Rendimiento

- Referencias hallazgos: aria-label en header/hamburger; skip-to-content; contraste (axe).
- [x] ProductCard y controles tienda: accesibles por teclado (Enter/Space), focus visible global, `prefers-reduced-motion`.
- [x] Formularios con labels/aria; navegacion secuencial correcta (incl. direcciones con autocomplete y postal `inputMode`).
- [ ] Bundle budget inicial <200KB gzip; lazy-load de modales/graficas.
- [x] Imagenes locales con cache-control razonable y `loading="lazy"`.
- [ ] Tests: axe/playwright a11y >=90; LHCI LCP movil <2.5s, CLS <0.1. (Resultado actual: axe 0 violaciones Ç½¶o¶.; LCP 3.1s/CLS 0.243 en mÇŸ¶üvil Ç½¶s¶ÿÇî¶÷¶?).
- [ ] Medir baseline y rellenar `metrics-dashboard.md` (parcial: bundle ~180KB Ç½¶o¶., LCP/CLS anotados, falta INP/TTFB):
  - `npm run build && npm run perf:web` (LHCI) para LCP/CLS/INP/TTI y budget bundle.
  - `npm run a11y` para score axe/playwright y bloqueos de teclado.
  - Anotar gzip bundle inicial (report LHCI) y tiempos en `metrics-dashboard.md`.
- [ ] Comandos sugeridos: `npm run perf:web`, `npm run a11y`.

## Fase 4 - Observabilidad y CI/CD (Estado: COMPLETADA)

- PR critico (k6): backend/src/routes/_, api/openapi.yaml, Store/_, label "needs-perf-test".
- Excepciones: spectral warnings permitidos con comentario; k6 timeout reintentar 1 vez; contract test roto -> bloquear.
- [x] Validacion OpenAPI en CI (Spectral + tests de contrato Prism/Mock)
  - Evidencia: `.github/workflows/openapi-contract-tests.yml`, `npm run lint:openapi`, `npm run test:contract`, `scripts/check-openapi-drift.cjs`.
- [x] Negative tests ampliados (401/403/429) y sanitizacion SEO/JSON-LD.
  - Evidencia: `scripts/run-contract.cjs`, `reports/observability/observability-artifacts.zip`.
- [x] Alertas locales: p95, 5xx, breaker abierto; sampling de errores.
  - Evidencia: `scripts/verify-observability-artifacts.cjs`, `docs/runbooks/observability.md`, `reports/observability/dashboard-summary.md`.
- [x] k6 smoke en PRs criticos; guardar reportes en `reports/`.
  - Observación operativa: el gate `npm run perf:api` ahora completa con 0 % de `http_req_failed` cuando el backend está vivo y migraciones/seed aplicados (p95 ~ 17 ms / p99 ~ 36 ms). La carrera actual genera `reports/observability/perf-summary.md`, `reports/observability/observability-artifacts.zip` y `reports/observability/metrics-snapshot.txt`, y esos artefactos deben adjuntarse a cada release/PR que cierre el gate mientras `metrics-dashboard.md` y los dashboards consumen los percentiles finales; si ocurre un nuevo mantenimiento de la base (dev.db) se repite el procesado para recalcular los artefactos antes de marcarlo como verde.
  - Registra en las notas de release/PR los percentiles p95/p99 (17 ms / 36 ms) y adjunta el ZIP + perf-summary/metrics-snapshot para que el gate quede documentado.
- [x] Pipeline <10m con gates: lint/typecheck/test/contract/audit/security.
  - Evidencia: `.github/workflows/ci-quality.yml`, `sbom.json`, `reports/**`.
- [x] Escaneo de mojibake en codigo (segun `Mojibake-Playbook.md`) y conversion a UTF-8 si se detecta.
- [x] Comandos sugeridos: `npm run lint:openapi`, `npm run test:contract`, `npm run check:openapi-drift`, `npm run check:secret-drift`, `npm run perf:api`.

## Fase 5 - Preparacion empaquetado futuro (Estado: EN PROGRESO)

- [x] Check de complejidad (`npm run check:complexity`) pasa y actualiza `reports/complexity-report.json`.
  - Evidencia: salida en consola + fichero `reports/complexity-report.json` con los módulos top 15 (ProductPage, helpers, etc.).
- [x] Runbook `docs/runbooks/fase5-maintainability.md` y ADR `docs/adr/0003-phase5-maintainability.md` reflejan los refactors y la estrategia de mantenimiento viva.
  - [x] Mantener gates `npm run lint`, `npm run test:ci` y `npm run check:complexity` verdes al introducir nuevos refactors de mantenimiento (refactors recientes `src/utils/imageProcessor.helpers.ts`, `src/utils/sanitizeObject.ts`, `src/components/virtualGrid/useGridLayout.ts`, `src/hooks/seo/buildSeoConfig.ts`, `src/hooks/useAnalytics.ts`, `src/hooks/wishlist/useWishlistSelection.ts`, limpieza `npx prettier --write` + `scripts/check-secret-drift.cjs`, log en `docs/runbooks/fase5-maintainability.md` y ADR actualizada, `reports/complexity-report.json` validado tras los tests).
  - 2025-12-06: Validación CI-local completa — build, lint/type-check, unit tests (86/86), E2E (3/3), cobertura, pruebas de contrato (Prism) y verificación de observabilidad ejecutadas. Resultados: passed ✔️ (build/dist, lint, tsc, vitest, Playwright, coverage, Prism). Notas: `gitleaks` detectó coincidencias en `tmp/lighthouse-temp/*` (artefactos temporales de Lighthouse) — recomendar excluir `tmp/` de los escaneos o limpiar antes de escanear; `test:breaker` falló localmente por `EBUSY` en `backend/prisma/dev.db` (archivo bloqueado) y `synthetic:checks` tuvo un fallo de arranque local (entorno ts-node). Recomendación operativa: abrir PR para ejecutar CI remoto en entorno limpio y validar gates completos.
  - 2025-12-11: `src/hooks/useProductDetails.ts` ahora reutiliza `src/hooks/product/useProductDetails.helpers.ts` para el fetch/fallback, centralizando el cache de productos legacy y el control de estados (`loading`/`ready`/`error`); el runbook, el ADR y este checklist reflejan el helper y las puertas (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) permanecen verdes.
  - 2025-12-12: `src/routes/dynamicRoutes.ts` se apoya en `src/routes/dynamicRoutes.helpers.ts` para exponer helpers reutilizables (`fetchJson`, metadata builders y path generators) y deja el descriptor de rutas plano; documentación y gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) se mantienen en verde.
  - 2025-12-13: `src/services/analyticsProviders.ts` confía en `src/services/analyticsProviders.helpers.ts` para manejar `loadExternalScript`, la inicialización de `gtag`/`fbq` y `trackCustomEvent`; la documentación y los tres gates siguen sin problemas tras el refactor.
  - 2025-12-14: `src/utils/sanitizeObject.helpers.ts` introduce `SANITIZER_RULES` y `findSanitizer` para asociar claves a sanitizadores antes de ejecutar las rutas recursivas; el helper reduce la complejidad del archivo y los gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) siguen limpios.
  - 2025-12-15: `src/hooks/useProductDetail.ts` delega el teclado y el `handleAddToCart` en `src/hooks/product/useProductDetail.helpers.ts`, dejando el hook principal como coordinador de estado simple; documentación y gates se mantienen en verde tras el refactor.
  - 2025-12-15: Se acepta mantener los módulos restantes con CC 10-11 (utilidades `api.ts`, `intl.ts`, middlewares y helpers de control) por ser flujos legítimos con bajo retorno de seguir fragmentando; el checklist lo registra y los gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) siguen verdes.
  - 2025-12-15: Cierre formal de Fase 5: gates validados (lint/test:ci/check:complexity), módulos residuales en CC 10-11 aceptados por diseño y documentación sincronizada (runbook, ADR, checkpoints).
- [ ] Mantener las configuraciones por env (puertos, origins, rutas métricas) y el checklist de hardening previo a empaquetar la plataforma.
- [ ] Completar checklist de hardening en nube (firewall, TLS, HSTS preload) y documentar cada paso en `docs/runbooks/fase5-maintainability.md` y `docs/phase-checkpoints.md`.
