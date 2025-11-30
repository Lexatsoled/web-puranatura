# Purga segura e irreversible de archivos sensibles del repositorio

Este documento describe el proceso planificado para eliminar archivos sensibles (backups, .env, logs, bases de datos) de TODO el historial Git del repositorio — es una operación destructiva que reescribe historia.

IMPORTANTE: antes de ejecutar la purga completa debe rotarse cualquier credencial expuesta y coordinarse con Seguridad/SRE. El proceso que se describe aquí crea un mirror local, limpialo con git-filter-repo y **no** empuja por defecto. Empujar (git push --force) debe hacerse únicamente después de verificación y aprobación.

---

Resumen del plan (alto nivel):

1. Comunicar y aprobar: abrir un issue o aviso en Slack/Teams con el plan, periodo de maintenance y responsables.
2. Rotar secretos en todos los entornos (CI, Vault, proveedores 3rd-party) y documentar el cambio.
3. Hacer un backup del repositorio (git clone --mirror).
4. Ejecutar git-filter-repo en el mirror con la lista de paths sensibles (ver sección Paths a eliminar).
5. Verificar que los archivos no aparecen en el mirror (gitleaks, git ls-files, búsqueda por extensión, etc.).
6. Compartir evidencia e invitar a dos reviewers (SRE + Security) para revisar antes del push.
7. Push --force del mirror limpio a origin (repositorio principal). Actualizar tags si procede.
8. Post-purge: pedir a todos los colaboradores que reclonen, reconfigurar CI, reintroducir artefactos necesarios fuera del repo, revalidar pipelines y ejecutar scans de seguridad en CI.

---

Paths sensibles sugeridos para purga (editar según hallazgos):

- `.env` (root)
- `.env.*` (variantes locales)
- `backend/.env`
- `backend/backups/` (todos los archivos dentro)
- `backend/*.sqlite`, `backend/*sqlite*` (db files and snapshots)
- `backend/database.sqlite.backup`
- `backend/database.legacy-before-bff.sqlite`
- `backend/out.log` y `backend/logs/*`

(Revisa `inventory.json` y `scripts/check-no-secrets.cjs` para otras rutas detectadas automáticamente.)

Checklist previo a la purga (ejecutar en orden):

- [ ] Aprobar plan con SRE/Sec/PM
- [ ] Rotar credenciales críticas (JWT_SECRET, provider API keys, SENTRY_DSN, BACKUP_ENCRYPTION_KEY, etc.)
- [ ] Identificar y extraer datos que deben permanecer (migrar backups a almacenamiento seguro y cifrado)
- [ ] Ejecutar `npm run scan:security` en la rama actual y archivar el reporte
- [ ] Crear mirror del repo (git clone --mirror) y comprobar integridad

Comandos de ejemplo (PowerShell):

```powershell
# crear mirror
git clone --mirror git@github.com:ORG/REPO.git repo-mirror
cd repo-mirror

# corrección filtrado (ejemplo con git-filter-repo)
python -m git_filter_repo --invert-paths --path backend/.env --path backend/backups --path backend/*.sqlite --path backend/out.log --path backend/logs

# Verificar ausencia
git ls-files | Select-String 'backend/backups' -SimpleMatch

# Si todo está OK: push forzado
# git push --force --all
# git push --force --tags
```

Post-purge: rotación y acciones de coordinación

- [ ] Forzar rotación final de todas las credenciales (comprobar que los secretos rotados fueron usados y anteriores revocados)
- [ ] Actualizar CI/CD y proveedores (rehacer secret stores y variables de entorno)
- [ ] Informar vía canal oficial (incluir comanands para que los colaboradores reclonen):
  ```powershell
  git clone git@github.com:ORG/REPO.git
  ```

---

Plantilla rápida de comunicación (copia/pega):

"En el marco de la limpieza de seguridad (Fase 0), vamos a purgar el historial para remover backups y secretos (BACKUPS, DB snapshots, .env). Fecha: YYYY-MM-DD HH:MM UTC. Acción: push --force en el repo remoto tras rotación de secretos. Requiere que todos los colaboradores vuelvan a clonar el repositorio. Contacto: SRE/Security."
