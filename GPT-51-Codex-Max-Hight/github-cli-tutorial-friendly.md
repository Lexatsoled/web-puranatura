# Git + GitHub CLI — Guía simple para crear PRs y depurar CI (para no técnicos)

Esta guía en castellano explica, de forma clara y concisa, cómo crear una rama, abrir un Pull Request (PR), comprobar los resultados de la integración continua (CI), y arreglar fallos hasta que todo quede verde.

---

## Explicación sencilla (para personas sin conocimientos técnicos)

Si nunca trabajaste con control de versiones o GitHub, aquí hay una explicación simple con analogías:

- Git: imagina que Git es como un sistema para guardar versiones de un documento (como un historial) — puedes volver a versiones anteriores y trabajar en copias sin estropear el original.
- GitHub: es un sitio en internet (un servicio) donde se guardan esos historiales y donde el equipo puede revisar los cambios antes de unirlos al proyecto principal.
- Rama (branch): es como una copia de trabajo de un documento donde puedes hacer tus cambios sin afectar el documento principal.
- Pull Request (PR): es una petición para que el equipo revise tus cambios en la rama y decida si los incorpora al documento principal. Es como pedir a un colega que revise y apruebe una propuesta de cambio.
- CI / Checks (integración continua): son pruebas automáticas que se ejecutan en el servidor cuando abres un PR. Comprueban que tu cambio no rompa cosas (build, tests, formateo, seguridad, etc.).
- Logs y artefactos: cuando algo falla, la CI deja evidencia — logs (registros de texto con errores) y artefactos (archivos que la CI guarda). Esos ayudan a entender qué salió mal.

Si esto suena nuevo, no te preocupes — las instrucciones más abajo son paso a paso y puedes seguirlas copypasteando los comandos.

## Instalación rápida (Windows)

Si necesitas instalar Git y la GitHub CLI en Windows, puedes usar el gestor `winget` (Windows 10/11) o descargar los instaladores desde la web.

Usando winget (PowerShell):

```powershell
winget install --id Git.Git -e --source winget
winget install --id GitHub.cli -e --source winget
```

O descarga los instaladores desde:

- Git: https://git-scm.com/download/win
- GitHub CLI: https://cli.github.com/

Después de instalar, configura Git con tu nombre y correo (esto identifica tus commits):

git config --global user.email "tu@correo.com"

````

Y autentica `gh` la primera vez con:

```powershell
gh auth login
````

Esto te pedirá iniciar sesión en GitHub y darle permisos al CLI.

## Resumen — qué vas a poder hacer

- Crear una rama y hacer push con un cambio mínimo para reactivar la pipeline.
- Abrir un PR desde la terminal.
- Consultar el estado de checks del PR.
- Ver logs detallados de ejecuciones / jobs de GitHub Actions.
- Descargar artefactos (por ejemplo `backend.log`) que ayudan a diagnosticar fallos.

## Herramientas necesarias

- Git
- GitHub CLI (`gh`) — [GitHub CLI](https://cli.github.com/)

## Pasos prácticos (PowerShell)

1. Crear y cambiar a una rama:

```powershell
git checkout -b chore/retrigger-readme-ci
```

2. Hacer cambios, commit y push:

```powershell
git add README.md
git commit -m "chore(ci): tiny README comment update to retrigger CI"
git push -u origin chore/retrigger-readme-ci
```

3. Abrir un PR con la GitHub CLI:

gh pr create --title "chore(ci): tiny README comment update to retrigger CI" --body "Touch README to re-run CI" --base main

```
gh pr checks 9 --repo Lexatsoled/web-puranatura (o la que corresponda)
```

Sustituye `9` por el número real del PR en tu repo.

4. Ver logs detallados de una ejecución (cuando conoces el run-id):

```powershell
gh run view <run-id> --repo Lexatsoled/web-puranatura --log -v
```

gh run download <artifact-id> --repo Lexatsoled/web-puranatura

---

## ¿Qué buscar en los logs / artefactos?

- Errores de TypeScript (p. ej. "Cannot find module 'prom-client'") → falta dependencia.
- Errores de bundling / import (p. ej. componente faltante) → añadir componente o corregir import.

## Ciclo de trabajo recomendado

1. Crear una rama pequeña para un fix.
2. Subir el commit + abrir PR.
3. Aplicar un fix localmente y repetir (commit → push → PR se actualiza automáticamente).

## Buenas prácticas

- No empujar directamente a `main` en proyectos colaborativos.
- Mantén commits pequeños y con un mensaje claro.
- Añade tests (unitario/e2e) para endpoints críticos como `/api/health` y `/metrics` para evitar regresiones.
- Documenta brevemente en el PR por qué cambiaste algo (logs/artefactos que demuestran la razón).

---

## Procedimiento reproducible: paso a paso (detallado)

Este procedimiento está pensado para que puedas repetir todo el flujo (crear rama → PR → depurar CI → arreglar → repetir) tantas veces como haga falta.

Requisitos previos:

- GitHub CLI (`gh`) instalada y autenticada con un token que tenga permisos de push/PR en el repo.
- Trabaja desde la raíz del repositorio en tu terminal PowerShell.

1. Preparar la rama de trabajo

- Escoge un nombre claro: `fix/ci-health-metrics`, `chore/add-tests-health`, `feat/metrics-endpoint`.
- Crea y cámbiate a la rama:

```powershell
git checkout -b fix/describe-el-problema-aqui
```

2. Trabaja localmente y prueba antes de subir

- Ejecuta linters, type-check y tests que correspondan:

```powershell
npm run lint
npm run type-check
npm run test:ci    # (o el script de tests de la carpeta que estés cambiando)
```

- Si arreglas código backend, prueba arrancar el servidor localmente y verifica /api/health y /metrics:

```powershell
cd backend
npm ci
npm run dev       # o el comando que use el proyecto para dev
curl http://127.0.0.1:3001/api/health
curl http://127.0.0.1:3001/metrics
```

3. Commit y push de la rama

- Sigue una convención de commit breve y clara del tipo:
  - fix(backend): arregla double collectDefaultMetrics
  - feat(metrics): añade endpoint /metrics
  - test(ci): añade test e2e de /api/health

```powershell
git add <archivos>
git commit -m "fix(ci): descripción corta y clara"
git push -u origin HEAD
```

4. Abrir Pull Request desde la terminal

```powershell
gh pr create --title "fix(ci): breve descripción" --body "Explica aquí el problema y la solución.\nLogs relevantes: <link o notas>" --base main
```

5. Verificar el estado de la CI y esperar a que corra

Para una vista rápida del estado del PR:

```powershell
gh pr checks <PR-number> --repo <owner>/<repo>
```

Si quieres esperar y ver los runs activos, lista los últimos runs:

6. Inspección de fallos — ver logs y artefactos

gh run view <run-id> --repo <owner>/<repo> --log -v

````


```powershell
gh run download <run-id> --repo <owner>/<repo> --name test-artifacts
# o descargar artefacto por su id
gh run download <artifact-id> --repo <owner>/<repo>
````

7. Qué buscar en los artefactos / logs

- Excepciones en runtime (stack trace en `backend.log`).
- Mensajes de lint/format que bloquean (prettier/ESLint con max-warnings=0).
- Scripts faltantes referenciados por workflows que terminan con código <>0.

8. Aplicar un fix y volver a iterar

- Corrige localmente según lo que encontraste.
- Commit → push y GitHub Actions volverá a ejecutarse automáticamente para el PR.

9. Re-ejecutar / volver a lanzar jobs manualmente (si procede)

- Puedes re-lanzar un run completo o solamente jobs fallidos usando `gh run rerun`:

```powershell
gh run rerun <run-id> --repo <owner>/<repo>
# Para reintentar solo un job específico (si conoces job id)
gh api -X POST /repos/<owner>/<repo>/actions/runs/<run-id>/rerun-jobs
```

10. Fusionar PR cuando todo esté verde

- Una vez todos los checks pasen y el PR tenga aprobación (si aplica), haz merge:

```powershell
- Plantilla de descripción de PR (útil para repetir):
```

Título: fix(ci): <breve descripción>

Qué arregla: <describe la regla / test / job que fallaba>

Prueba local: <comandos que ejecutaste y resultado>

Logs relevantes: <run-id o enlaces> (incluir artefactos si los descargaste)

Notas: <cualquier nota adicional>

```

---

## Checklist rápido antes de push/PR

- [ ] Linter local correcto
- [ ] Type-check pasado
- [ ] Tests unitarios relevantes ejecutados
- [ ] Server arrancado y endpoints críticos verificados si aplica
- [ ] Mensaje de commit y PR claro con evidencia (logs/artefactos)

---
```
