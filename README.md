# Run and deploy your AI Studio app

<!-- ci: trivial touch to retrigger workflows (bot) - updated 2025-11-26 -->

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install` <!-- asegura que `node_modules` se genera antes de compilar -->
2. Copy `.env.local.sample` to `.env.local` and set `GEMINI_API_KEY` to your Gemini API key.
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

Esto evita errores durante la secuencia de validaciones (lint, type-check, build, tests).

> > > > > > > origin/main
> > > > > > > _Nota:_ este README se actualizó solo para reactivar el pipeline y no cambia el comportamiento de la aplicación.
> > > > > > > Pequeña nota para CI: este commit es solo para re-lanzar los checks y asegurar que lint/format/contract sigan verdes.
