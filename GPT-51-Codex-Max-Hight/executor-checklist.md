# Checklist Ejecutable (paso a paso para IA/ejecutores)

## Antes de empezar
- Leer `plan-maestro.md` y `calendar.md` para saber la fase actual.
- Cargar variables: `BASE_URL` (por defecto http://127.0.0.1:3001), `SMOKE_USER=smoke@puranatura.test`, `SMOKE_PASS=SmokeP@ss123`.
- Confirmar deps: `npm ci` y `npm --prefix backend ci`.

## Secuencia mínima por fase (comandos literales)
1) **Lint/Tipos/Formato**  
   `npm run lint && npm run type-check && npm run format:check`
2) **Unit/Integration**  
   `npm run test:ci`
3) **Contratos**  
   `npm run test:contract`
4) **E2E**  
   `npm run test:e2e`
5) **A11y**  
   `npm run a11y`
6) **Performance**  
   `npm run perf:api`  
   `npm run perf:web`
7) **Seguridad**  
   `npm run scan:security`
8) **Fuzz (validaciones)**  
   `npm run test:fuzz`
9) **Smoke (post-deploy/local)**  
   `npm run smoke`

## Datos y seeds
- Ejecutar seeds antes de pruebas locales:  
  `npm --prefix backend run db:seed` (si no existe, usar `npx prisma db seed --schema=backend/prisma/schema.prisma`).
- Usuario de smoke: `smoke@puranatura.test` / `SmokeP@ss123` (se crea en seed).
- Versiones de herramientas: ver `tooling-versions.md` si hay incompatibilidades.
- Ayuda rápida si algo falla: ver `faq-dificultades.md`.

## Orden de trabajo por fase (resumen accionable)
- F0: eliminar secretos/DB del repo, rotar claves; `npm run scan:security`.
- F1: ajustar helmet/CSP/CORS/rate-limit/CSRF, validar zod en rutas; `npm run scan:security`.
- F2: actualizar OpenAPI + contract tests; migraciones Prisma; `npm run test:contract`.
- F3: lazy catálogo/modales, optimizar imágenes, a11y modales; `npm run perf:web && npm run a11y`.
- F4: activar tracing/logs/alertas y pipeline; `npm run perf:api && npm run smoke`.
- F5: refactors (CC<10), pre-commit, ADRs.

## Salidas que deben existir antes de avanzar
- Reportes: coverage, LHCI, k6, gitleaks/trivy, SBOM.
- Artefactos: openapi.yaml, migraciones, ADRs actualizados, dashboards configurados.

## Reglas de parada
- No avanzar si hay vulnerabilidades high/critical, audit high>0, gitleaks con hallazgos, contract tests fallan, LCP >3s, API P95 >500ms, o smoke falla.

## Dónde mirar
- Hallazgos ↔ tareas: sección “Matriz de trazabilidad” en `plan-maestro.md`.
- Roles y due dates: `raci.md`, `calendar.md`.
- Comandos rápidos: arriba en esta checklist.

## Nota
Seguir literalmente los comandos en este archivo reduce ambigüedad para modelos menos capaces. Si un comando falla, reportar el error y no improvisar cambios de código sin revisar los hallazgos/plan.
