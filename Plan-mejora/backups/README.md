# Backups (plantilla)

Este directorio sirve como referencia para almacenar snapshots y hashes. No contiene datos reales.

Sugerencia de estructura cuando se use:

- `backups/dev-YYYYMMDD.db` — copia de SQLite.
- `backups/Secretos-YYYYMMDD/` — copia de la carpeta Secretos/.
- `backups/hashes.txt` — sha256 de cada artefacto.
- `backups/snapshot-YYYYMMDD.tgz` — paquete comprimido opcional.

Instrucciones detalladas en `Plan-mejora/Runbook-Backups.md`.
