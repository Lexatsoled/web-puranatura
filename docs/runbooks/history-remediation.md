# Runbook: Remediación de historial — secretos y artefactos sensibles

Encontramos coincidencias de secretos en el historial y en el working-tree (reporte generado por gitleaks). Este runbook describe pasos seguros para limpiar el repositorio **sin** romper el trabajo del equipo — incluye alternativas y acciones recomendadas.

⚠️ Importante: Reescribir historial es una operación disruptiva: obliga a tod@s l@s contribuidores a re-clonar o a ejecutar pasos para sincronizar sus forks y branches. NO hagas force-push a `main` sin comunicarlo y coordinar un mantenimiento.

Resumen de hallazgos

- Escaneo working-tree: 2 coincidencias en `.env.local` (archivo local). ✅
- Escaneo histórico: ~104 coincidencias en `archive/` y `reports/tmp/` (artefactos y docs con credenciales o dumps). ⚠️

Prioridad inmediata (acciones que ya hemos hecho)

- Rotación de secrets (hecho) — JWT, refresh, REDIS, BACKUP_ENCRYPTION_KEY, SENTRY_DSN rotados.
- Eliminación de `.env.local` en working-tree y confirmación de `.gitignore` cubriendo `*.local`.

Acciones recomendadas next (mi prioridad sugerida)

1. Inventario: lee `reports/gitleaks-report-history.json` y decide qué coincidencias representan secretos activos vs. artefactos obsoletos.
2. Rota claves externas si alguna coincide con servicios reales.
3. Limpiar artefactos sensibles del historial (git-filter-repo o BFG). Esto requiere coordinación:
   - Clona `--mirror` el repo en una máquina de admin.
   - Ejecuta `git-filter-repo` con las rutas apropiadas y revisa el resultado localmente.
   - Prueba desplegar el mirror purgado a un remote temporal para validación.
   - Si todo OK, forzar `git push --force --all` y `git push --force --tags` al remote original.
4. Post-purge: notificar a colaboradores, proporcionar instrucciones para que re-clonen o hagan el `git fetch && git reset` adecuados.

Scriptes/Helpers incluidos

- `scripts/purge-history.sh` — helper bash que hace clone mirror, ejecuta git-filter-repo y deja el repo purgado en `tmp-repo-purged.git` para inspección.
- `scripts/purge-history.ps1` — versión PowerShell equivalente.

Plan de comunicación (ejemplo)

1. Avisar en Slack/email indicando ventana de mantenimiento y que habrá reescritura de historial.
2. Invitar a todos a guardar cambios locales y no hacer pushes durante la ventana.
3. Ejecutar purge en mirror y verificar.
4. Forzar push y enviar instrucciones para que todos re-clonen:
   - `git clone <repo>` (nuevo repo), o si prefieren actualizar:
   - `git fetch origin && git reset --hard origin/main && git clean -ffdx` (esto descarta cambios locales!)

¿Quieres que ejecute el filtro ahora en un mirror y deje el repo purgado listo para inspección, o prefieres que solo prepare todo y lo revises antes de ejecutar la reescritura final?
