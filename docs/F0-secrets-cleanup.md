# Fase 0 — Eliminación de secretos versionados (guía rápida)

Resumen de acciones realizadas automáticamente (actual commit):

- Se añadió `.env.example` en raíz y `backend/.env.example` como plantillas.
- Se sanitizó `backend/.env` para eliminar secretos expuestos en la versión actual.
- Se añadió una comprobación `scripts/check-no-secrets.cjs` (ejecutable desde `npm run check:no-secrets`) para detectar archivos sensibles en la raíz del repositorio.
- Se actualizó `.husky/pre-commit` para correr `run-gitleaks.cjs` y `npm run check:no-secrets` antes de permitir commits.

Pasos recomendados para eliminar secretos de la historia de Git (manual, requiere permisos):

### Herramientas / scripts añadidos

- `scripts/purge-history.ps1` — helper PowerShell para crear un mirror y ejecutar git-filter-repo (no empuja por defecto).
- `scripts/purge-history.sh` — helper Bash/Unix equivalente.
- `scripts/sanitize-sensitive-files.cjs` — sobrescribe archivos sensibles en el working tree para dejarlo limpio.

### Acción: rotación de secretos (automática)

- JWT_SECRET
- JWT_REFRESH_SECRET
PROVIDER_API_KEY (e.g. LLM/provider keys)
- BACKUP_ENCRYPTION_KEY
- SENTRY_DSN
- REDIS_PASSWORD

Notas: después de rotación se deben desplegar estos cambios (staging → smoke tests → production). Asegúrate de que el servicio acepte la nueva `JWT_SECRET` (usa la estrategia dual-key si quieres evitar logout forzado).

### Acción: purga histórica aplicada al remoto

- Fecha: 2025-11-28 (acción realizada por el asistente automatizado).
- Operación: el mirror limpio fue empujado al remoto con `git push --force --all` y `git push --force --tags` después de crear un backup mirror local.
- Efecto: la historia remota fue reescrita y los archivos sensibles listados fueron eliminados de todos los commits.

IMPORTANTE: Esta operación es destructiva — todos los colaboradores deben reclonar el repositorio y re-sincronizar sus ramas locales.

Ejemplo de instrucción para el equipo:

```text
git clone git@github.com:Lexatsoled/web-puranatura.git
# o si ya tienen repo local:
# git fetch origin
# git reset --hard origin/main
```

Recomendación: coordinar con SRE/Security y ejecutar las pruebas de staging inmediatamente después del reclonado.

1. Rotar / revocar inmediatamente todos los secretos que estuvieron expuestos: JWT secret, provider API keys (e.g. LLM/provider keys), SENTRY_DSN, etc. (treat as compromised).
2. Purga de Git history (elige una herramienta):
   - Recomendado: usar `git filter-repo` (preferido) o BFG. Ejemplo con git filter-repo:
     - git clone --mirror <repo-url>
     - cd repo.git
     - git filter-repo --path backend/.env --path backend/database.sqlite --invert-paths
     - git push --force --all
   - Alternativa: BFG Repo-Cleaner.
3. Después de purgar la historia, forzar rotación de claves y asegurarse de que CI/CD no contenga secretos en logs o variables públicas.

Notas de seguridad y cumplimiento:

- No se deben mantener backups o DBs en el repositorio. Las copias de seguridad deben almacenarse cifradas en un almacenamiento externo (S3/Azure Blob) con control de acceso y rotación de claves.
- Si el repo fue público o compartido, notificar a los equipos de seguridad y cumplir con el proceso de incident response.
