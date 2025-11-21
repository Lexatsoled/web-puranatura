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
- `scripts/orchestrator.mjs` (ci optional step guard + Prettier formatting fix)
- `GPT-51-Codex/ToDo/backlog.md` (T4.2 -> Ready for review)
- `GPT-51-Codex/Hallazgos/log-debug.md` (CI-WORKFLOW-002)

 
## Checklist (antes de merge)

- [ ] Crear branch `fix/ci-orchestrator-lint` y push a GitHub
- [ ] Abrir PR con title, reviewers `@Lexatsoled` (owner), `@DevOpsTeam`, y `@QA` (o los aliases del repo)
- [ ] Actualizar `package-lock.json` (ejecutar `npm install` y commitear el lock actualizado)
- [ ] Añadir `.nvmrc` con `20` y documentar Node 20 para desarrolladores (opcional)
- [ ] Verificar que la versión de Node en `ci.yml` es la 20 ('Setup Node.js' -> `node-version: '20'`)
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

> Nota: Tras aplicar un ajuste de formato en `scripts/orchestrator.mjs` para eliminar una advertencia de Prettier, ejecuté `node .\scripts\orchestrator.mjs ci` localmente y el pipeline completo (lint, unit, e2e, build) se ejecutó con éxito; `ci:security` fue saltado porque no está definido.
```

## Si no tienes `nvm` (Windows) — comandos alternativos

1. Instalar Node 20 y regenerar `package-lock.json` con PowerShell (winget):

```powershell
# Instalar Node 20 con winget (Windows)
winget install OpenJS.NodeJS -s winget --accept-source-agreements --accept-package-agreements

# Verificar versión (necesita 20)
node -v

# Actualiza el lockfile
npm install

# Confirma y push
git add package-lock.json
git commit -m "chore: update package-lock for Node 20" || echo "No changes to lockfile"
git push origin fix/ci-orchestrator-lint
```

1. Alternativa: usar Docker (si no quieres cambiar Node global)

```powershell
# Ejecuta npm install dentro de un contenedor Node 20 y actualiza lockfile
docker run --rm -v ${PWD}:/work -w /work node:20-bullseye bash -lc "npm install && chown -R $(id -u):$(id -g) package-lock.json"

# Revisa y commitea
git add package-lock.json
git commit -m "chore: update package-lock for Node 20" || echo "No changes to lockfile"
git push origin fix/ci-orchestrator-lint
```

 
## Nota de seguridad y CI

- `ci.yml` ya incluye `npx --yes prisma migrate deploy` con fallback `prisma db push`, y `npx playwright install --with-deps` para instalar navegadores en runners. Revisar timeouts si la ejecución de `build` o `prisma` tarda demasiado.
 - `ci.yml` ahora usa Node 20 para evitar EBADENGINE con dependencias que requieren Node >=20; recuerda actualizar local `package-lock.json` si lo cambias.
 - Añadida nota `engines.node >= 20` en `package.json` y `backend/package.json`.

---
Solicito revisión de CI para validar migraciones en runner Linux y tests E2E (Playwright) en PR antes del merge.
## Actualizacion 2025-11-22
- lint/test/build/e2e pasaron localmente tras corregir rules-of-hooks en StorePage y endurecer sanitizeProductContent (placeholder https para imagenes maliciosas).
