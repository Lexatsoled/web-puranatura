---
title: "[CI] Arreglos: orquestador, lint, hooks y Playwright en CI"
created: 2025-11-20
owner: DevOps
---


## Pull Request: Arreglos para CI — `fix/ci-orchestrator-lint`

 
## Resumen

Este PR recoge cambios para estabilizar el pipeline de CI en GitHub Actions y mejorar la ejecución local via `scripts/orchestrator.mjs`:

- Corregidos `react-hooks` que se llamaban condicionalmente en `UserMenu` y `ProductPage`.
- Arreglados warnings de ESLint (catch unused variables -> `catch {}`) en `scripts/run-e2e.cjs`, `vitest.setup.ts`, `components/CartModal.tsx`.
- Robustecí `scripts/orchestrator.mjs` para no fallar si el script `ci:security` no está definido.
- Re-escribí tests E2E para mejorar selectores y sincronización (ya en `e2e/` — cambios menores revisados localmente).

 
## Archivos modificados

- `components/UserMenu.tsx` (hooks ordenados)
- `src/pages/ProductPage.tsx` (hooks ordenados)
- `components/CartModal.tsx` (catch -> catch {})
- `scripts/run-e2e.cjs` (catch -> catch {})
- `vitest.setup.ts` (catch -> catch {})
- `scripts/orchestrator.mjs` (ci optional step guard)
- `GPT-51-Codex/ToDo/backlog.md` (T4.2 -> Ready for review)
- `GPT-51-Codex/Hallazgos/log-debug.md` (CI-WORKFLOW-002)

 
## Checklist (antes de merge)

- [ ] Crear branch `fix/ci-orchestrator-lint` y push a GitHub
- [ ] Abrir PR con title, reviewers `@Lexatsoled` (owner), `@DevOpsTeam`, y `@QA` (o los aliases del repo)
- [ ] Revisar la ejecución de `ci.yml` en GitHub Actions (especialmente: `prisma migrate` y Playwright en runner Linux)
- [ ] Verificar que `reports/` y `test-results/` se suben como artifacts
- [ ] Si falla `migrate`, usar `prisma db push` fallback y documentar en PR

 
## Cómo probar localmente

 
```powershell
# Crear y subir rama
git checkout -b fix/ci-orchestrator-lint
git add .
git commit -m "Fix: CI pipeline, move hooks & fix lint warnings"
git push -u origin fix/ci-orchestrator-lint

# Crear PR desde CLI (opcional) usando GitHub CLI
gh pr create --title "[CI] Orquestador y lint fixes" --body "file:GPT-51-Codex/PRs/ci-orchestrator-lint-pr.md" --reviewer Lexatsoled --assignee Lexatsoled

# Orquesta la pipeline localmente
node .\scripts\orchestrator.mjs ci
```

 
## Nota de seguridad y CI

- `ci.yml` ya incluye `npx --yes prisma migrate deploy` con fallback `prisma db push`, y `npx playwright install --with-deps` para instalar navegadores en runners. Revisar timeouts si la ejecución de `build` o `prisma` tarda demasiado.

---
Solicito revisión de CI para validar migraciones en runner Linux y tests E2E (Playwright) en PR antes del merge.
