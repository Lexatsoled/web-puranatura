# Prompt inicial para continuar el plan (leer y ejecutar)

Instrucciones para la IA (GPT-5-mini, GPT-4.1, etc.):

1. Carga de contexto: lee estos archivos en orden para entender el estado y el plan completo:
   - `README.md` (índice del plan).
   - `plan-maestro.md` (fases, gates, criterios de salida).
   - `execution-guide.md` (comandos exactos a ejecutar y fases).
   - `arquitectura.md`, `security-playbook.md`, `testing-strategy.md`, `ci-cd.md`, `refactor-roadmap.md`, `observabilidad.md`, `performance-playbook.md`, `data-governance.md`, `feature-flags.md`, `security-threat-model.md`, `runbooks/incident-response.md`, `runbooks/backup-dr.md`, `api/openapi-guide.md`, `api/openapi.yaml`, `package-scripts.md`, `ci/pipeline-example.yml`.

2. Resumen del estado actual:
   - CI real (`.github/workflows/ci.yml`) tiene jobs quality (PR) + main-guard (main) con lint, typecheck, unit, contract, e2e, gitleaks, perf API; en main añade LHCI y `npm audit --production --audit-level=high`.
   - Scripts en `package.json`: `test:contract`, `perf:api`, `perf:web`, `scan:security`, `format:check` ya listos.
   - Herramientas listas: k6, LHCI, prism, gitleaks (vía npx).
   - Plan maestro v1.1 con gates por fase y orden recomendado (seguridad → datos/contratos → UX/perf → observabilidad/CI → refactor).

3. Objetivo: continuar o completar tareas pendientes siguiendo los gates. No saltar fases con críticos abiertos.

4. Si debes ejecutar acciones:
   - Usa los comandos de `execution-guide.md`.
   - En PRs: ejecuta (en bash/WSL) `npm run lint && npm run type-check && npm run test:ci && npm run test:contract && npm run scan:security && npm run perf:api` — si trabajas en PowerShell (Windows) usa `;` como separador o ejecuta cada comando por separado.
   - En main o entregable final: añade `npm run perf:web` y `npm audit --production --audit-level=high`.
   - Para E2E: `npm run test:e2e` (tras build y backend en marcha si aplica).

5. Si necesitas revisar archivos clave del repo para contexto adicional:
   - Código frontend en `pages/`, `components/`, `src/`.
   - Backend en `backend/src/`, Prisma en `backend/prisma/`.
   - Datos legacy en `data/`.

6. Reglas de seguridad y cumplimiento:
   - No exponer secretos; validar con `scan:security` (gitleaks).
   - Mantener CSP, CSRF, rate-limit, roles (ver `security-playbook.md`).
   - Producir cambios alineados con el plan y sus gates; documentar excepciones.

7. Formato esperado de salidas cuando avances:
   - Explica qué fase/gate cumples.
   - Comandos ejecutados o a ejecutar.
   - Resultados y próximos pasos bloqueados/desbloqueados.

Con esto, cualquier IA debe poder continuar de manera determinista y sin perder el contexto del trabajo previo.
