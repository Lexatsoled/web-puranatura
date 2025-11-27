# Tutorial práctico: usar Git + GitHub CLI para iterar PRs y depurar CI

Este archivo compila las instrucciones breves y los comandos que usar para crear una rama, abrir un Pull Request, inspeccionar el estado de CI (GitHub Actions), descargar artefactos y depurar fallos desde la terminal (PowerShell).

⚠️ Antes de empezar: asegúrate de tener Git configurado y haber instalado la GitHub CLI (`gh`) en tu máquina. También necesitas permisos de push/PR sobre el repositorio.

---

## Explicación muy simple (sin tecnicismos)

- Git: imagina un cuaderno con páginas de versiones. Cada vez que guardas, Git recuerda la versión. Si algo sale mal, puedes volver a una versión anterior.
- GitHub: es el lugar en Internet donde se guarda ese cuaderno para el equipo. También ejecuta pruebas automáticas cuando propones cambios.
- Rama (branch): es una copia del cuaderno donde trabajas tus cambios sin tocar el original.
- Pull Request (PR): es como decir "he terminado mi propuesta, ¿la revisas?". Aquí el equipo y la máquina (CI) revisan si todo está bien.
- CI / Checks: son pruebas automáticas (build, tests, escaneos) que se ejecutan cuando creas un PR para validar que tu cambio no rompe nada.
- Logs / Artefactos: si alguna prueba falla, la máquina deja evidencia (registros y archivos). Esos archivos se descargan para ver exactamente qué ocurrió.

---

## ¿Qué necesitas antes de empezar?

- Tener Git instalado y configurado (tu nombre y tu correo) en tu PC.
- Tener GitHub CLI (`gh`) instalada y autenticada para interactuar con GitHub desde la terminal.
- Permisos para crear ramas y abrir PRs en el repositorio (si no los tienes, pide a la persona responsable que te de acceso o que lo haga por ti).

Si necesitas ayuda instalando Git o `gh`, consulta la sección "Instalación rápida (Windows)" abajo.

---

## Instalación rápida (Windows)

Usa PowerShell (Windows 10/11) y `winget` si lo tienes:

```powershell
winget install --id Git.Git -e --source winget
winget install --id GitHub.cli -e --source winget
```

Si no usas `winget`, descarga los instaladores:

- Git: [https://git-scm.com/download/win](https://git-scm.com/download/win)
- GitHub CLI: [https://cli.github.com/](https://cli.github.com/)

Configura tu identidad en Git (solo la primera vez):

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu@correo.com"
```

Autentica `gh` la primera vez (te guiará para iniciar sesión):

```powershell
gh auth login
```

---

## Resumen rápido — lo que vas a poder hacer con estos pasos

- Crear una rama de trabajo para tus cambios (sin tocar el código principal).
- Subir tus cambios al repositorio remoto (GitHub).
- Abrir un Pull Request para que el equipo y la CI revisen los cambios.
- Revisar el estado de los checks (si han pasado o fallado).
- Descargar logs y artefactos desde la ejecución de la CI y leerlos para entender errores.
- Repetir el ciclo hasta que todas las pruebas pasen.

---

## Pasos prácticos (PowerShell) — con explicaciones simples

1. Crear y cambiar a una rama (copia de trabajo)

```powershell
git checkout -b fix/descripción-corta-del-problema
```

Qué hace: crea una copia para que trabajes sin tocar el código principal. Es como hacer una copia de tu documento para editar.

2. Hacer tus cambios, preparar el commit y subir la rama al servidor

```powershell
git add <archivos-que-cambiaste>
git commit -m "fix(ci): descripción corta y clara"
git push -u origin HEAD
```

Qué hace: guarda localmente tu cambio con una nota (commit) y lo sube a GitHub para que quede disponible.

3. Abrir un Pull Request (PR) desde la terminal

```powershell
gh pr create --title "fix(ci): título corto" --body "Explica el problema y la solución. Agrega logs o notas si los tienes." --base main
```

Qué hace: crea la petición para que tu equipo y la máquina revisen tu propuesta.

4. Ver el estado de los checks (si la CI pasó o falló)

```powershell
gh pr checks <PR-number> --repo <owner>/<repo>
```

Qué debes mirar: si ves errores (failing) — la CI te dirá en qué trabajo falló (tests, build, lint, etc.).

5. Ver logs detallados de un run concreto (cuando conoces el run-id)

```powershell
gh run view <run-id> --repo <owner>/<repo> --log -v
```

Qué hace: muestra la salida completa del trabajo — muy útil para ver la causa de un error.

6. Descargar artefactos (por ejemplo `backend.log`) para investigarlos

```powershell
gh run download <run-id> --repo <owner>/<repo> --name test-artifacts
# o si conoces el id del artefacto
gh run download <artifact-id> --repo <owner>/<repo>
```

Qué hace: guarda los archivos que el job subió (logs, reports), para que los puedas abrir y revisar localmente.

---

## Consejos sencillos para interpretar errores (qué buscar)

- "Cannot find module" o "TS2307": falta una dependencia (librería). Significa que el proyecto necesita que añadas algo en package.json.
- Errores de "import" o "module not found": alguna parte del código importa un archivo o componente que no existe.
- Excepciones durante arranque (runtime): busca en `backend.log` la traza (stack trace) para ver qué archivo lanzó la excepción.
- Fallos de formateo o lint: la CI puede exigir que el código pase linters o formato (Prettier/ESLint). Arregla localmente y vuelve a subir.

---

## Proceso reproducible y seguro (para hacer repetidas iteraciones)

Sigue este ciclo cada vez que la CI detecte un fallo:

1. Mira la salida del job con `gh run view` y descarga artefactos.
2. Reproduce el error localmente si puedes (ejecuta tests, inicia servidor, etc.).
3. Corrige el problema en tu rama y ejecuta linters/tests localmente.
4. Commit → push. GitHub Actions ejecutará la CI automáticamente.
5. Repite hasta que todos los checkpasen.

Extras:

- Re-ejecutar jobs: `gh run rerun <run-id> --repo <owner>/<repo>` — útil si el fallo fue intermitente.
- Cuando todo esté verde y tengas aprobación: `gh pr merge <PR-number> --merge --delete-branch` para fusionar y limpiar la rama.

---

## Checklist rápido (antes de crear el PR)

- [ ] Código probado localmente (tests / arranque si aplica).
- [ ] Linter y type-check pasados.
- [ ] Commit y PR con una descripción clara y logs/artefactos (si aplican).

---
