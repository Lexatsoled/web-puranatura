# FAQ de Dificultades Comunes

## Falla `npm run test:contract`
- Verifica que `openapi.yaml` esté actualizado (plan-maestro F2).
- Re-genera tipos desde OpenAPI si se usan en cliente/servidor.
- Revisa drift (Prism/Dredd logs) y corrige rutas o contrato.

## Gitleaks encuentra secretos
- No commits nuevos; remover archivo y rotar claves.
- Revisar `.gitignore`; asegurarse de que .env/.sqlite no estén versionados.
- Ejecutar `npm run scan:security` después de limpiar.

## CSP bloquea scripts/mapas
- Usa modo report-only primero; añade dominios requeridos (GA, FB, Maps).
- Aplica flag `cspEnforce` al pasar a enforce; revisar consola y LHCI.

## LHCI falla por LCP/CLS/INP
- Revisa `performance-playbook.md` y `checklists/perf.md`.
- Lazy-load de catálogo/modales; optimiza imágenes; fija dimensiones.
- Ajusta budgets solo tras optimizar.

## A11y “serious” en axe
- Revisa `checklists/a11y.md`.
- Añade role/aria/focus trap en modales; labels y aria-invalid en inputs; contraste.

## k6 rompe umbrales
- Revisa índices Prisma y cache/ETag en /products.
- Ajusta rate-limit si es muy agresivo para la prueba; validar timeouts.

## Smoke falla (login/orden)
- Asegura seeds corridos (`npx prisma db seed --schema=backend/prisma/schema.prisma`).
- Define `SMOKE_USER` y `SMOKE_PASS` (usuario seed).
- Revisa `BASE_URL`; backend debe estar levantado.

## npm audit high > 0
- Intenta `npm audit fix --force` solo en rama aislada; documenta overrides en security-playbook y ci-cd.
- Usa SBOM/licencias para revisar impacto.

## Migración Prisma falla
- Aplica backup; revisa `migracion.md`; usa `prisma migrate resolve --rolled-back` si fue parcial.
- Corre `prisma db push` solo en dev; no en prod.

## Rutas 404 (analytics)
- Implementa /api/analytics/events (plan-maestro F2 T2.5).
- Añade zod + rate-limit; actualizar OpenAPI y contract tests.
