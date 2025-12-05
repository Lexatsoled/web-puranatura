# Prompt Inicial para Agente IA (PuraNatura)

Usa este prompt al iniciar o retomar trabajo para cargar el contexto completo del plan de mejora.

## Objetivo

Aplicar el plan de mejora (seguridad, resiliencia, UX/A11y, rendimiento, CI/CD) sin Docker/K8s, con secretos locales y SQLite dev, siguiendo las fases y playbooks establecidos.

## Archivos a leer (orden)

1. `Plan-mejora/Resumen-Ejecutivo.md` — prioridades P0/P1/P2, prerequisitos y métricas de salida por fase.
2. `Plan-mejora/Plan-Maestro.md` — fases, alcances, métricas de salida, riesgos, hallazgos previos.
3. `Plan-mejora/Checklist-Plan-Maestro.md` — en qué fase estamos y qué ítems restan (incluye comandos sugeridos).
4. Playbooks según lo que toque:
   - Backups: `Plan-mejora/Runbook-Backups.md`
   - Breaker: `Plan-mejora/Breaker-Playbook.md` y `Plan-mejora/Breaker-Test-Plan.md`
   - Secretos: `Plan-mejora/Design-check-secret-drift.md`
   - Perf/A11y: `Plan-mejora/Perf-A11y-Playbook.md`
   - OpenAPI: `Plan-mejora/OpenAPI-Contract.md`
   - Mojibake: `Plan-mejora/Mojibake-Playbook.md`
5. README general del plan: `Plan-mejora/README.md` (comandos rápidos, prerequisitos, variables de entorno).

## Estado actual (resumen)

- Breaker implementado en `backend/src/services/catalogBreaker.ts`, activable con `BREAKER_ENABLED=true`.
- Script de backup seguro (VACUUM INTO): `backend/scripts/safe-backup.cjs` → `npm run backup:safe`.
- Prerrequisitos: gitleaks y k6 instalados; `npm run check:setup-plan` pasa en verde.
- lint-staged actualizado a ^16.2.7; `npm audit` limpio.
- Checks rápidos pasan: `npm run check:secret-drift -- --warn-missing`, `npm run check:no-secrets`, `npm run check:openapi-drift`.
- Comando de prueba de breaker: `npm run test:breaker` (para forzar OPEN, ver Breaker-Test-Plan).

## Variables de entorno clave (dev)

- `BREAKER_ENABLED` y `BREAKER_THRESHOLD/OPEN_TIMEOUT/HALF_OPEN_PROBES` si se prueba el breaker.
- `DATABASE_URL=file:./prisma/dev.db` (default).
- `ALLOWED_ORIGINS=http://localhost:5173`, `CSP_REPORT_ONLY=true` en dev.
- JWT_SECRET/REFRESH en `Secretos/backend.env.local` (no versionado).

## Pruebas rápidas recomendadas al retomar

- `npm run check:secret-drift -- --warn-missing`
- `npm run check:no-secrets`
- `npm run check:openapi-drift`
- `npm run check:setup-plan`

## Notas

- Secretos están en `Secretos/` (gitignored); no subirlos.
- Si usas el breaker en dev/staging, levanta backend con `BREAKER_ENABLED=true` antes de `npm run test:breaker`.
- Revisar la nota de revisión periódica: actualizar `Plan-mejora/*.md` cada 4–6 semanas o tras cambios de stack.
