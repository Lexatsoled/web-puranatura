# Runbook: Onboarding y migración de secretos (Guía rápida)

Este runbook explica paso a paso cómo preparar y subir los secretos del repositorio a GitHub Secrets (o a un vault) sin necesidad de modificar la infraestructura o tener permisos de administración del repositorio. Está pensado para alguien con acceso de colaborador que puede usar la CLI `gh` localmente.

Importante — reglas de seguridad

- Nunca comitees archivos `.env` o `.env.local` que contengan valores reales.
- Usa siempre un fichero `.env.local` en tu máquina local y no lo subas al repo.
- Las acciones administrativas (rotación a escala de la organización o protección de ramas) requieren permisos de administrador.

Resumen — pasos principales

1. Generar/validar el manifiesto de variables requeridas (`.github/required-secrets.yml`).
2. Preparar un fichero local `.env.local` con los valores (no lo comitees).
3. Con `gh` CLI autenticado, subir secretos con `scripts/gh-set-secrets.cjs` o pedir a un admin que los cree.
4. Validar localmente con `npm run deploy:check` y en CI con los workflows existentes (`Validate required repo secrets`).

Requisitos previos (local)

- Node 20+ y npm
- GitHub CLI (`gh`) si vas a subir secretos desde tu máquina (autenticado como un usuario con acceso de escritura al repo)

Paso 1 — Detectar / generar el manifiesto de secretos

```bash
# Escanea el repo y escribe la lista en .github/required-secrets.yml
node scripts/list-required-secrets.cjs --write
```

Paso 2 — Preparar `.env.local` (mismo formato que `.env.example`)

- Crea un archivo `.env.local` en la raíz del repo (sólo en tu máquina) y rellena las variables que aparecen en `.github/required-secrets.yml`.
- Ejemplo rápido: usa `./.env.local.example` como plantilla.

-Paso 3 — Subir secretos a GitHub (con `gh`)

- Antes de ejecutar en modo real, prueba con `--dry-run` para comprobar qué se subirá sin aplicar cambios.
- Dry-run (NO modifica secrets):

```bash
# Simula la subida sin cambiar nada
node scripts/gh-set-secrets.cjs --file .github/required-secrets.yml --env-file .env.local --dry-run
```

- Si todo se ve bien, ejecuta la subida real (requiere `gh` instalado y autenticado):

```bash
# Sube realmente los secrets a GitHub (tu usuario debe tener permisos)
node scripts/gh-set-secrets.cjs --file .github/required-secrets.yml --env-file .env.local
```

- Si la organización gestiona secretos a nivel org, usa la opción `--org ORG_NAME` para subir secretos de organización desde `gh` (requiere permisos org/owner).

Administradores — rotación segura

- Un administrador puede rotar las claves con la utilidad PowerShell incluida:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/rotate-secrets.ps1 -Repo "Lexatsoled/web-puranatura"
```

Esto genera valores fuertes y los sube como secrets del repo (NO imprime los valores en pantalla).

Paso 4 — Validación (local y CI)

- Local (se ejecuta una verificación ligera):

```bash
npm run deploy:check
```

Si faltan secretos, el script `scripts/deploy-check.cjs` devolverá un error listando los secretos ausentes.

- En CI: el workflow `Validate required repo secrets` (fichero `.github/workflows/validate-required-secrets.yml`) comprueba que todos los secretos listados en `.github/required-secrets.yml` existen en el repositorio.

Comprobaciones automáticas en el repo

- `npm run check:no-secrets` ejecuta `scripts/check-no-secrets.cjs` — útil para evitar comitear archivos `.env` o backups sensibles.

Generar `.env.local` automáticamente (opcional)

- Si no estás seguro qué valores generar, hay un helper que crea un `.env.local` poblado con valores seguros (dry-run por defecto):
  - Dry-run (no escribe nada):
    ```bash
    node scripts/generate-env-local.cjs --file .env.local --dry-run
    ```
  - Escribir el `.env.local` (sobrescribe si ya existe, usa `--yes` para confirmar):
    ```bash
    node scripts/generate-env-local.cjs --file .env.local --yes
    ```
  - Esto es útil para entornos locales de desarrollo — revisa el fichero antes de subir secretos a GitHub.

Consideraciones finales

- Mantén la lista en `.github/required-secrets.yml` mínima — sólo las variables que el pipeline o la app necesitan en producción.
- Para entornos de producción prefiero: secretos a nivel de organización + restricciones de repositorio/entorno, y rotación periódica.
- Si necesitas que suba secretos desde aquí, indícame si cuentas con `gh` y acceso de escritura; si no, prepárate para ejecutar un par de comandos locales (te doy pasos exactos).

Evidencia y seguimiento

- Revisa el workflow `Validate required repo secrets` para ver si la verificación ha pasado en `main`.
- Mantén este archivo actualizado si nuevas variables imprescindibles aparecen.

Fin del runbook — si quieres, aplico cambios adicionales (por ejemplo, añadir una plantilla `.env.local` para cada entorno o un workflow que haga rotación con aprobación manual).
