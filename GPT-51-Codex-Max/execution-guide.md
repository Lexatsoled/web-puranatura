# Guía de Ejecución (para IA/automatización)

Objetivo: que cualquier agente (GPT-5-mini, GPT-4.1, etc.) ejecute el plan sin ambigüedad.

## Prerrequisitos

- Node 20+, npm 10.
- Ejecutar en raíz del repo.
- Variables mínimas (para CI/local): `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ALLOWED_ORIGINS`, `DATABASE_URL` (por defecto `file:./backend/prisma/database.sqlite`).

## Paso a paso (resumen)

1. Instalar deps raíz y backend:
   - `npm ci`
   - `npm --prefix backend ci`
   - Nota: para ejecutar una secuencia local de prueba (smoke) que arranca el backend y corre los checks mínimos, puedes usar el script de conveniencia `scripts/run-ci-smoke.ps1` en Windows PowerShell:

   ```powershell
   .\scripts\run-ci-smoke.ps1 -RunE2E:$false
   ```

2. Lint + types: `npm run lint && npm run type-check` (en bash/WSL). En PowerShell usa `npm run lint; npm run type-check` o ejecuta los comandos por separado.
3. Build backend y migrar (dev): `npm --prefix backend run build` y `npx prisma migrate deploy --schema=backend/prisma/schema.prisma` (o `prisma db push` si no hay migraciones).
4. Build frontend: `npm run build`
5. Tests:
   - Unit/integration: `npm run test:ci`
   - Contrato: `npm run test:contract` (usa `api/openapi.yaml` y prism mock)
   - E2E: `npm run test:e2e`
   - Seguridad: `npm run scan:security`
   - Perf API smoke: `npm run perf:api`
   - En main: `npm run perf:web` y `npm audit --production --audit-level=high`
6. A11y (si se requiere en fase 3+): `node scripts/axe-playwright.cjs` (o integrar en CI).
7. Backups (manual): `BACKUP_KEY=... ./GPT-51-Codex-Max/scripts/backup.sh backend/database.sqlite backups/`

## Fases y comandos mínimos

- F0/F1: pasos 1-5 (sin perf web), gitleaks incluido en `scan:security`.
- F2: añadir tests de dominio (contrato ya cubre) y perf API smoke.
- F3: incluir `npm run perf:web` (LHCI) y axe-playwright.
- F4/F5: desplegar con canary/blue-green (ver `ci/pipeline-example.yml`), asegurar tracing/logs activos.

## Artefactos y rutas clave

- OpenAPI: `GPT-51-Codex-Max/api/openapi.yaml`
- Pipeline ejemplo: `.github/workflows/ci.yml` (calibrado) y `GPT-51-Codex-Max/ci/pipeline-example.yml` (plantilla).
- Perf: `GPT-51-Codex-Max/perf/k6-api-smoke.js`, `GPT-51-Codex-Max/perf/lhci-config.json`
- Backups: `GPT-51-Codex-Max/scripts/backup.sh`, `restore.sh`

## Convenciones

- No avanzar de fase si gates fallan (ver `plan-maestro.md`, sección “Secuencia óptima y gates”).
- Usar scripts `npm run ...` tal cual; no reinventar comandos.
- Documentar cualquier excepción o fallback en el PR/MR correspondiente.
