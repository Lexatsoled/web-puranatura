# Plan Maestro de Mejora (PuraNatura)

> Objetivo: ejecutar un refuerzo integral de seguridad, resiliencia, UX/A11y, rendimiento y CI/CD sin depender de SaaS adicionales ni migraciones prematuras. Todo preparado para que cualquier agente (incl. modelos ligeros) siga los pasos sin ambigÃ¼edades.

## Contexto y principios

- Stack actual: React 19 + Vite + Zustand; backend Express 5 + Prisma (SQLite dev); CI con lint/typecheck/tests, ZAP/Trivy/CodeQL/LHCI; k6 scripts disponibles; sin contenedores aÃºn.
- Restricciones: sin vault/DB SaaS; mÃ©tricas abiertas solo en entornos controlados; imÃ¡genes y secretos bajo control local; servidor inicial on-prem.
- Principios: minimizar superficie (deny-by-default), degradar con gracia, pruebas negativas, reproducibilidad local, cambios reversibles, mÃ©tricas claras por fase.

## Estructura de trabajo por fases (orden recomendado)

GuÃ­a rÃ¡pida para agentes:

- Paso 1: Lee este Plan-Maestro.
- Paso 2: Usa `Checklist-Plan-Maestro.md` como guÃ­a de ejecuciÃ³n.
- Paso 3: Consulta los playbooks especÃ­ficos cuando el checklist lo indique.
- Paso 4: Los esqueletos en `Plan-mejora/scripts/*.skeleton.*` son plantillas; copia y adapta fuera de `Plan-mejora/` antes de activarlos.
- Paso 0: Revisa `Resumen-Ejecutivo.md` (prioridades P0/P1/P2 y prerequisitos).

0. Baseline y hardening mÃ­nimo
1. Seguridad prioritaria
2. Resiliencia y estabilidad (circuit breaker catÃ¡logo)
3. UX/A11y y rendimiento inicial
4. Observabilidad y CI/CD
5. PreparaciÃ³n para empaquetado futuro (sin ejecutarlo aÃºn)

Cada fase incluye: alcance, tareas, entregables, pruebas, mÃ©tricas de Ã©xito y rollback.

---

### Fase 0 â€“ Baseline y hardening mÃ­nimo (1â€“2 dÃ­as)

- Entradas (precondiciones):
  - Node >= 20, npm disponible; `Secretos/` gitignored.
  - Entornos: dev/staging sin vault ni Docker.
- Alcance:
  - Activar `trust proxy` en backend y asegurar cookies sensibles (`Secure` en prod).
  - Proteger `/metrics` con auth bÃ¡sica/token y/o allowlist de red (dev/staging) sin romper scraping interno.
  - Estructura de secretos local: carpeta `Secretos/` (gitignored) + checklist de respaldo manual.
  - RotaciÃ³n de logs y snapshots diarios de `backend/prisma/dev.db` + `Secretos/`.
  - Headers base: `Referrer-Policy: same-origin`, `Permissions-Policy` restrictiva, `X-Download-Options: noopen`.
- Entregables:
  - Config final en backend (app.ts/middleware) y doc de uso de `Secretos/`.
  - Script planificado `scripts/check-secret-drift.cjs` (antes de PR: alerta si faltan secretos o si se detectan patrones sensibles fuera de `Secretos/`).
- Pruebas:
  - Vitest/Supertest para `/metrics` (401/403 vs token OK).
  - Verificar cookie Secure en prod y SameSite Strict.
  - Check manual de headers en `/api/health`.
- MÃ©tricas de Ã©xito:
  - NingÃºn endpoint sensible pÃºblico sin credencial.
  - CSRF/Auth cookies con `Secure` en prod; headers presentes.
- Rollback:
  - Revertir auth en `/metrics` si rompe monitoreo, manteniendo allowlist temporal.
- Prioridad interna P0/P1:
  - P0: Secretos/.required.json presente; check-secret-drift OK; /metrics protegido; trust proxy + cookies Secure; headers base.
  - P1: npm audit fix (dependencias) y confirmar gitleaks instalado.

### Fase 1 â€“ Seguridad prioritaria (3â€“5 dÃ­as)

- Entradas:
  - Fase 0 completada; `Secretos/` estructurado.
- Alcance:
  - Endurecer CSP: sin `'unsafe-inline'`, aÃ±adir `scriptSrcAttr 'none'`, nonces por peticiÃ³n, modo enforce en prod (reportOnly opcional en dev).
  - CSRF: mantener doble-submit pero con secure flag y validaciÃ³n consistente tras proxy.
  - Rate limiting: por IP (ya) y por usuario en auth/analytics (cabecera opcional en test env).
  - Refresh tokens: asegurar borrado/rotaciÃ³n aunque falle storage (manejo de errores silencioso ya presente).
  - Secret scanning local: integrar `scripts/check-no-secrets.cjs` + nuevo `check-secret-drift.cjs` en pre-commit/CI.
- Entregables:
  - CSP actualizada, tests `backend.cspHeader.test.ts` y payloads negativos.
  - LÃ­mite por usuario en auth/analytics.
  - Hooks de pre-commit actualizados.
- Pruebas:
  - Vitest: 401/403/429 en auth y analytics.
  - ZAP baseline sin alertas CSP crÃ­ticas.
- MÃ©tricas / salida de fase:
  - CSP sin `unsafe-inline`, nonces activos; tests 401/403/429 verdes.
  - 0 hallazgos high/critical en escaneos internos.
  - CSP violations/1k req < 1 en staging.
- Rollback:
  - Volver a reportOnly temporalmente si UI se rompe, manteniendo nonce.
- Prioridad interna P0/P1:
  - P0: CSP con nonce lista (reportOnly), lista de URLs/flujos a validar antes de enforce; rate-limit por usuario en auth/analytics; check-secret-drift en CI/pre-commit.
  - P1: report-uri local para CSP; whitelist documentada si hay inline legÃ­timos.

### Fase 2 â€“ Resiliencia y estabilidad (2â€“4 dÃ­as)

- Entradas:
  - Fase 1 completa; CSP estable.
- Alcance:
  - Circuit breaker para `/products`: si falla DB, abrir circuito, responder 503 + `X-Backend-Degraded: true`, no re-seed en request; cierre tras backoff y health ok.
  - SQLite robusto: modo WAL, lÃ­mites de concurrencia en writes (cola ligera), monitorear locks y tamaÃ±o.
  - Backups: cron local/shell para snapshot diario y prueba mensual de restore (documentado).
  - Pruebas de caos ligeras (opcional local): simular DB caÃ­da 1â€“2 min y validar respuesta degradada.
- Entregables:
  - ImplementaciÃ³n breaker + mÃ©trica de aperturas/cierres.
  - Script/documento de backup/restore.
  - GuÃ­a de WAL/monitoreo SQLite (`Plan-mejora/SQLite-WAL-Monitoring.md`) con pasos PowerShell.
- Pruebas:
  - Vitest: flujo degradado y 503 esperado; catÃ¡logo vuelve tras recuperar DB.
  - k6 local smoke: p95 estable y sin timeouts bajo carga ligera.
- MÃ©tricas / salida de fase:
  - p95 /products < 300ms en estado sano; 0 reseeds en tiempo de peticiÃ³n.
  - Tasa de apertura de breaker monitoreada; error budget definido.
  - Breaker abre/cierra correctamente en pruebas de fallo/recuperaciÃ³n; backup+restore validados.
- Rollback:
  - Desactivar breaker y volver a fallback de datos legacy temporalmente si hay falsos positivos.
- Prioridad interna / implementaciÃ³n incremental:
  - Paso 2.1: Health check `/api/health` con SELECT 1 (prerequisito breaker).
  - Paso 2.2: Breaker bÃ¡sico CLOSED/OPEN (umbral conservador, p.ej. 10 fallos) sin HALF_OPEN.
  - Paso 2.3: AÃ±adir HALF_OPEN y probes controladas (implementaciÃ³n base en backend/src/services/catalogBreaker.ts, activable por flag en rutas cuando corresponda).
  - Nota SQLite: si `dev.db` > 500MB, considerar VACUUM; linde ~1GB con WAL.

### Fase 3 â€“ UX / A11y / Rendimiento inicial (3â€“4 dÃ­as)

- Entradas:
  - Fase 2 completa; breaker estable.
- Alcance:
  - Accesibilidad: ProductCard y controles de tienda navegables por teclado; foco visible global; `prefers-reduced-motion`; etiquetas/aria en formularios.
  - Rendimiento: budget de bundle inicial < 200KB gzip; lazy-load modales/graficas; mantener imÃ¡genes locales pero con cache-control razonable y `loading="lazy"`.
  - SEO/seguridad: continuar sanitizando JSON-LD y contenido; validar que no hay `dangerouslySetInnerHTML` sin `sanitizeHtml`.
- Entregables:
  - Cambios en componentes (ProductCard, StorePage inputs) y estilos de foco.
  - Budgets documentados y verificados en CI (LHCI).
- Pruebas:
  - axe/playwright a11y: score â‰¥90.
  - LHCI: LCP mÃ³vil <2.5s, CLS <0.1 (baseline/objetivo).
- MÃ©tricas / salida de fase:
  - 0 bloqueos de teclado en flujos de compra.
  - Bundle inicial cumple presupuesto.
  - LHCI LCP <2.5s (mÃ³vil), CLS <0.1; axe/playwright â‰¥90.
- Rollback:
  - Revertir tweaks de animaciones si hay regresiÃ³n visual; mantener foco visible.
- Referencias a hallazgos (ejemplos):
  - A11Y-001: header/hamburger sin aria-label â†’ aÃ±adir aria-label dinÃ¡mico.
  - Skip-to-content link si falta.
  - Contraste: validar con axe/CLI.

### Fase 4 â€“ Observabilidad y CI/CD (2â€“4 dÃ­as)

- Entradas:
  - Fase 3 completa; budgets estables.
- Alcance:
  - Contrato OpenAPI en CI: spectral + prism/mock tests; drift check FE/BE.
  - Negative tests ampliados (401/403/429) y sanitizaciÃ³n SEO.
  - Alertas locales: p95, 5xx rate, breaker abierto; sampling de errores para no llenar disco.
  - k6 local: baseline smoke antes de merges importantes; guardar reportes en `reports/`.
- Entregables:
  - Pipeline CI actualizado con gates (lint/typecheck/test/contract/audit).
  - Dashboards/alertas locales descritos.
- Pruebas:
  - CI verde con nuevas etapas.
  - k6 smoke <30s, error rate <1%.
- MÃ©tricas / salida de fase:
  - NingÃºn PR sin contrato OpenAPI vÃ¡lido.
  - Tiempo de pipeline <10 min.
  - Gates de contrato/seguridad activos; escaneo de mojibake ejecutado y limpio.
- Rollback:
  - Desactivar gate individual si bloquea por falso positivo, documentando excepciÃ³n.
- DefiniciÃ³n de PR crÃ­tico (k6):
  - Cambios en backend/src/routes/_, api/openapi.yaml, componentes de Store/_, label "needs-perf-test".
- Excepciones permitidas:
  - spectral warnings: permitir con comentario si no es error.
  - k6 timeout de red: reintentar 1 vez.
  - contract test roto por ejemplo viejo: bloquear hasta corregir spec.

### Fase 5 â€” PreparaciÃ³n para empaquetado futuro (sin ejecutarlo ahora)

- Alcance:
  - Mantener configuraciones vÃ­a env (puertos, origins, rutas de mÃ©tricas) para facilitar Docker posterior.
  - Documentar `Dockerfile`/`docker-compose` borrador (no ejecutar).
  - Checklist de hardening cuando se mueva a nube (firewall, TLS, HSTS preload).

---

## Backlog priorizado (resumen tÃ¡ctico)

1. Proteger `/metrics` + trust proxy + cookies Secure.
2. CSP endurecida con nonces; rate-limit por usuario.
3. Circuit breaker catÃ¡logo + WAL + backups.
4. A11y teclado/foco y budgets de bundle.
5. Contrato OpenAPI en CI + tests negativos + k6 smoke.
6. Scripts de secretos (`check-secret-drift.cjs`) y backups documentados.

---

## Entregables en `Plan-mejora/`

- `Plan-Maestro.md` (este documento).
- `Checklist-Plan-Maestro.md` (tareas accionables por fase).
- Artefactos futuros (aÃ±adir segÃºn se creen): scripts de chequeo, playbooks de backup/restore, k6 reportes, notas de caos, etc.

## Supuestos y riesgos

- Sin vault externo: depende de disciplina y scripts de detecciÃ³n de secretos.
- SQLite: riesgo de bloqueo en alta concurrencia; mitigado con WAL y lÃ­mites.
- MÃ©tricas: protegerlas temprano evita fugas cuando el host se exponga.
- Sin CDN: vigilar ancho de banda y cache headers para imÃ¡genes.
- Vars de entorno críticas (defaults dev): ver README (PORT=3001, ALLOWED_ORIGINS=http://localhost:5173, CSP_REPORT_ONLY=true en dev, JWT_SECRET/REFRESH en Secretos, RATE_LIMIT*, AUTH_RATE_LIMIT*, ANALYTICS_RATE_LIMIT*, DATABASE_URL=file:./prisma/dev.db, BREAKER* si se habilita). Para tests/CI usa siempre `DATABASE_URL=file:./prisma/dev.db`; si ejecutas Vitest desde la raíz, exporta esa variable antes de `npm test`/`npm run test:ci` para evitar rutas duplicadas.
- Mojibake: si aparece encoding mixto (Ãƒ, Ã‚, ï¿½), usar `Mojibake-Playbook.md` para detectar y convertir a UTF-8; evitar copiar texto cp1252 sin conversiÃ³n.
- Estimaciones: aplicar buffer ~30% sobre el rango de dÃ­as para cubrir iteraciones y pruebas adicionales.

## Hallazgos previos a atender (referencia rÃ¡pida)

- A11Y-001: Header/hamburger sin aria-label (aÃ±adir aria-label dinÃ¡mico). Ej: `components/Header.tsx` (buscar toggle).
- A11Y: Falta skip-to-content; validar contraste con axe.
- MAINT-001: framer-motion `positionTransition` deprecated (actualizar uso) donde aparezca en componentes animados.
- MAINT-002: TODOs pendientes (marcarlos o resolverlos).
- DOC-001/002: README/Changelog desactualizados (sincronizar tras cambios clave).

## Tabla de riesgos rÃ¡pidos (acciÃ³n / rollback)

- CSP rompe UI: volver temporalmente a reportOnly manteniendo nonce; revisar inline styles.
- Breaker abre por falso positivo: subir umbral o desactivar con `BREAKER_ENABLED=false`; revisar logs de fallos.
- Falta `Secretos/`: crear carpeta, copiar `.required.example.json` a `.required.json` y poblar; no continuar fases sin esto.
- `/metrics` inaccesible para monitoreo: ajustar allowlist/token; evitar reabrir pÃºblico.
- Bundles exceden budget: aplicar splitting/lazy y reintentar LHCI; si persiste, revertir dependencia pesada.
- Mojibake: si se detectan patrones, convertir el archivo a UTF-8 (ver Mojibake-Playbook) y re-ejecutar lint/test.

## MÃ©tricas globales de Ã©xito

- Seguridad: 0 high/critical abiertos; CSP sin `unsafe-inline`; cookies Secure en prod.
- Resiliencia: breaker operativo; p95 /products <300ms sano; backups verificados.
- UX/A11y: score â‰¥90 (axe/LHCI); navegaciÃ³n teclado completa.
- Rendimiento: LCP <2.5s mÃ³vil; bundle inicial <200KB gzip.
- CI/CD: pipeline <10m con gates de contrato y auditorÃ­a; tests negativos cubriendo auth/ratelimits.
