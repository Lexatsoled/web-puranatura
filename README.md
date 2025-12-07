# Run and deploy your AI Studio app

<!-- ci: trivial touch to retrigger workflows (bot) - updated 2025-12-01 (manual re-run by infra agent) -->

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install` <!-- asegura que `node_modules` se genera antes de compilar -->
2. Copy `.env.local.sample` to `.env.local` and set the runtime secrets you need (do not commit real secrets). The project does not include built-in LLM provider keys by default.
3. Run `npm run lint` to verify formatting and coding standards locally (opcionalmente con `-- --watch` para cambios rápidos).
4. Opcionalmente, usa `npm run test:ci` para validar la suite completa localmente si necesitas confianza extra (especialmente antes de subir un PR).
5. Si trabajas en Windows, detente y reintenta el lint con `cross-env` si ves errores raros de rutas o diferencias de mayúsculas; los símbolos ':' pueden fallar en algunos shells.
6. Para contribuir, crea un branch de trabajo y sincroniza con `main` antes de hacer `npm install`, así evitas divergencias del upstream (especialmente tras rebases o force pushes). Si trabajas con forks, apunta `origin` al tuyo y `upstream` al repo oficial.
7. Run the app:
   `npm run dev`

### Nota para desarrollo local: auto-seed y pruebas E2E 🧪

- El servidor backend en modo desarrollo intentará auto-popular la base de datos
  si detecta que está vacía (seed). Esto evita que la UI caiga a datos hardcode
  al iniciar un entorno nuevo.
- Añadimos una prueba E2E nueva para la tienda (`e2e/store.spec.ts`) que valida
  que la página `/tienda` renderiza tarjetas de producto. También hay una prueba
  de integración backend (`test/backend.seedFallback.test.ts`) que simula fallos
  en la lectura de la BD y comprueba que el endpoint utiliza el fallback legacy
  cuando procede.
  - Implementación adicional (dev-only): si la lectura de la BD falla el
    servidor intentará sembrar la base de datos (seed) y re-consultar. Si el
    seed falla como último recurso se utiliza el `data/products.ts` legacy del
    frontend para mantener la UI funcional en entornos locales. Los objetos de
    este fallback ahora usan campos deterministas (`id` y `updatedAt`) para
    asegurar que los cálculos de `ETag` sean estables entre llamadas — esto
    evita inconsistencias en tests y necesidades de recarga en la UI.

## Formato y hooks pre-commit (recomendado)

## Secret migration & CI helpers 🔐

- We provide a small playbook and helpers to migrate secrets out of the repo and into a secure provider (GitHub Secrets, Vault, etc.). See `docs/secrets-migration.md` for details.

This project no longer includes built-in AI endpoints and does not perform
direct calls to LLM providers. It does not require or expect provider API keys
for LLMs to be present in the repository or CI. If you need LLM capabilities,
integrate them via an external orchestrator (for example n8n) using secure
webhooks and properly rotated keys managed outside the repo.

## Changelog: removal of built-in AI endpoint

- 2025-11-29: The project removed the built-in `/api/ai` endpoint and removed direct integrations with LLM providers. This keeps the codebase free of provider keys and avoids accidental provider usage. Use external orchestrators (n8n, workflows, webhooks) to integrate LLMs if needed.

- Useful scripts:
  - `node scripts/list-required-secrets.cjs --write` — scans the code base for env vars and writes `.github/required-secrets.yml`.
  - `node scripts/gh-set-secrets.cjs --file .github/required-secrets.yml --env-file .env.local` — helper to upload secrets using `gh` CLI (requires gh auth).
  - `npm run deploy:check` — dry-run check to verify required secrets are available in the environment.

  - `node scripts/gh-set-secrets.cjs --file .github/required-secrets.yml --env-file .env.local --dry-run` — prueba (no cambia nada) para validar qué secrets se subirían.
  - `node scripts/generate-env-local.cjs --file .env.local --dry-run` — genera localmente un `.env.local` poblado (dry-run muestra el resultado sin escribir).
  - `node scripts/generate-env-local.cjs --file .env.local --yes` — escribe `.env.local` con valores seguros (útil para desarrollo local).
  - `scripts/purge-history.sh` / `scripts/purge-history.ps1` — helpers para preparar (mirror clone) y ejecutar `git-filter-repo` para purgar rutas sensibles del historial. **No** fuerces push sin coordinación.

  ### Runbook y guía paso a paso

  Si necesitas una guía paso a paso (en español) para preparar y subir secretos de forma segura sin usar la UI del administrador, revisa el runbook:

  `docs/runbooks/secrets-onboarding.md`

Make sure `.env.local` or any real secret files are never committed and remain in `.gitignore`.

Para evitar que commits o PRs fallen por reglas de formato, recomendamos habilitar hooks locales con Husky + lint-staged.

1. Instalar las dev-deps localmente (si no están instaladas):

```powershell
npm install --save-dev husky lint-staged prettier
```

1. Activar husky (crea la carpeta .husky y los hooks):

```powershell
npm run prepare
npx husky add .husky/pre-commit "npx --no-install lint-staged"
```

1. El proyecto ya incluye `.prettierrc.json` y `lint-staged` configurado para ejecutar Prettier en los archivos modificados antes de cada commit.

Nota sobre `lint-staged` y stashes: hemos actualizado la configuración del proyecto para ejecutar `lint-staged` en modo no concurrente y sin crear stashes automáticos (las tareas no deberán usar `git add`). Esto reduce sorpresas en grandes árboles de trabajo y evita stashes ocultos que puedan generar confusión. Si tu flujo requiere operaciones complejas, recomendamos usar worktrees para pruebas o commits locales antes de enviar PRs.

Esto evita que archivos como `regression-suite.md` lleguen a la CI con formato incorrecto.
_Nota:_ este README se actualizó solo para reactivar el pipeline y no cambia el comportamiento de la aplicación.

⚠️ **Nota para entornos con restricciones**: en algunos entornos de ejecución `npm` puede no estar disponible por motivos de seguridad o políticas (por ejemplo, entornos gestionados). Si encuentras errores relacionados con `npm` por favor revisa `HOW_TO_ENABLE_NPM.md` en la raíz del repo para pasos y recomendaciones sobre cómo habilitarlo o alternativas para ejecutar los checks.

Para facilitar la Fase 0 (inventario/baseline) sin necesidad de `npm`, hay un script PowerShell que genera un inventario SHA256 de los ficheros del repo:

```powershell
.\scripts\generate-inventory.ps1 -OutFile inventory-baseline.json
```

⚠️ Nota importante sobre instalación de dependencias en Windows: algunos procesos (Vite, esbuild, Rollup, editores) pueden bloquear archivos binarios en node_modules y provocar errores EPERM al ejecutar `npm ci`. Si ves fallos como "EPERM: operation not permitted, unlink ... esbuild.exe" o `"vite" no se reconoce como un comando`, sigue estas opciones:

- Cerrar VS Code / procesos que puedan usar node_modules (o reiniciar el equipo).
- Ejecutar PowerShell como Administrador y luego forzar reinstall:

```powershell
$env:FORCE_REINSTALL='1'
.\scripts\run-ci-smoke.ps1
```

- Si prefieres un approach manual:
  1.  Cerrar procesos que bloqueen archivos (tasklist / findstr esbuild / node), detenerlos o reiniciar el sistema.
  2.  Eliminar `node_modules` (Remove-Item -Recurse -Force .\node_modules) y volver a ejecutar `npm ci`.

Si encuentras errores persistentes por archivos bloqueados (EPERM, esbuild.exe en uso), prueba el script de reparación (ejecutar PowerShell como Administrador):

```powershell
.\scripts\repair-node-modules.ps1 -Path .\node_modules -Force
$env:FORCE_REINSTALL='1'
.\scripts\run-ci-smoke.ps1
```

## Quality gates en CI


- La Fase 4 añade more gates: `npm run perf:api` (k6 smoke con p95 actual ~96.9 ms / error rate 40 % porque el login intenta usar la tabla `main.User` que no existe en el SQLite vacío; documenta ese fallo y vuelve a correr después de sembrar datos), `npm run lint:openapi`, `npm run test:contract`, y `npm run verify:observability` (para validar `reports/observability/observability-artifacts.zip`). Coloca los reportes en `reports/` para adjuntarlos a los PRs críticos.

## Escaneos de seguridad — exclusiones y protecciones (nuevo)

Hemos añadido controles para reducir falsos positivos en los escaneos de seguridad (Trivy / gitleaks) y evitar que artefactos temporales o bases de datos de desarrollo acaben en el repositorio.

- Archivo de ignore para Trivy: `.trivyignore` en la raíz del repositorio. Contiene patrones comunes (tmp/, coverage/, `dev.db*`, `*.db`, `*.sqlite`, `reports/`, node_modules/) para evitar escanear artefactos generados localmente.
- Configuración de gitleaks: `.github/.gitleaks.toml` — contiene allowlists que excluyen reportes generados y artefactos transitorios.
- Hooks locales (Husky): se añadió un script `check:forbidden-artifacts` que bloquea commits si los archivos a commitear contienen artefactos prohibidos (p. ej. `dev.db`, `tmp/`, `coverage/`, `*.db`, `*.sqlite`). Esto evita que se introduzcan accidentalmente archivos grandes o sensibles.
- CI: el workflow de Trivy (`.github/workflows/trivy-scan.yml`) ahora incluye una comprobación temprana que falla si se detectan artefactos prohibidos en el árbol del repo (por ejemplo `dev.db` o `coverage/`).

Cómo ejecutarlo localmente (rápido):

```bash
# comprobar artefactos prohibidos (staged -> pre-commit, o repo -> CI)
npm run check:forbidden-artifacts

# ejecutar gitleaks con la configuración del repositorio (local)
node scripts/run-gitleaks.cjs --config .github/.gitleaks.toml --no-git --source . --report-path ./reports/gitleaks-report.json

# ejecutar Trivy local con la ignore file
trivy fs --ignorefile .trivyignore -f sarif -o trivy-results.sarif .
```

Consejo: las reglas de exclusión deben ser concretas. Evita patterns demasiado amplios que puedan ocultar secretos. Si necesitas añadir excepciones adicionales, actualiza `.trivyignore` o `.github/.gitleaks.toml` y documenta la razón en este mismo README.

Esto evita errores durante la secuencia de validaciones (lint, type-check, build, tests).

> > > > > > > origin/main
> > > > > > > _Nota:_ este README se actualizó solo para reactivar el pipeline y no cambia el comportamiento de la aplicación.
> > > > > > > Pequeña nota para CI: este commit es solo para re-lanzar los checks y asegurar que lint/format/contract sigan verdes.
> > > > > > > \ n C I   n o i s e   s u p p r e s s i o n   v e r i f i c a t i o n :   2 0 2 5 - 1 2 - 0 3 T 0 9 : 2 2 : 1 7 . 8 0 5 9 6 2 7 - 0 4 : 0 0 
> > > > > > >  
> > > > > > >  
