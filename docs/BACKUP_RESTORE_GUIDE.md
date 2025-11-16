# Guía de Backup y Restauración

## Variables de entorno

```bash
BACKUP_DIR=./backups
BACKUP_ENCRYPTION_KEY=tu-clave-segura
BACKUP_DAILY_RETENTION=30
BACKUP_MONTHLY_RETENTION=12
BACKUP_COMPRESS=true
BACKUP_SCHEDULE=0 2 * * *
```

- `BACKUP_DIR`: carpeta donde se almacenan los archivos `.sqlite[.gz][.enc]`.
- `BACKUP_ENCRYPTION_KEY`: clave usada para derivar AES‑256; sin ella los backups encriptados no pueden restaurarse.
- `BACKUP_DAILY_RETENTION`: número de backups diarios que se conservan.
- `BACKUP_MONTHLY_RETENTION`: cantidad de snapshots mensuales archivados.
- `BACKUP_COMPRESS`: comprime con gzip antes de encriptar.
- `BACKUP_SCHEDULE`: cron (formato standard) para el job automático.

## CLI

Todos los comandos se ejecutan desde `backend/`:

```bash
npm run backup:create [full|incremental]   # default full
npm run backup:list
npm run backup:restore <ruta-del-backup>
npm run backup:check
```

`backup:list` muestra timestamp, tamaño e integridad. `backup:check` ejecuta `PRAGMA integrity_check` sobre la base actual.

## Flujo de restauración

1. `npm run backup:list` y elige el archivo adecuado.
2. `npm run backup:restore backups/....sqlite.gz.enc`
3. Espera confirmación del CLI.
4. `npm run backup:check` para validar integridad.
5. Reinicia el backend.

Durante la restauración se genera una copia de seguridad del archivo vigente (`database.sqlite.<timestamp>.bak`) para rollback inmediato.

## Automatización

El job en `src/jobs/backupJob.ts` usa `node-cron` y el schedule configurado. Cada ejecución:

1. Sincroniza WAL, corre `PRAGMA integrity_check`.
2. Copia `database.sqlite`, comprime, encripta (si aplica) y calcula SHA-256.
3. Guarda metadatos (`.meta.json`) con stats, checksum y IV.
4. Aplica retención (30 diarios + 12 mensuales por defecto).
5. Loggea el resultado.

## Encriptación y restauración

- Algoritmo: AES‑256‑CBC. El IV se almacena en el metadata JSON (no sensible).
- Si `BACKUP_ENCRYPTION_KEY` no está definida, los archivos se guardan sin encriptar.
- Sin la clave correcta, restaurar un backup cifrado será imposible.

## Buenas prácticas

- Replica `BACKUP_DIR` a un almacenamiento offsite (S3, GCS, etc.).
- Nunca cometas el directorio de backups en Git.
- Cambia la clave de encriptación si sospechas compromiso (re-generar backups).
- Usa `BACKUP_SCHEDULE` distinto en staging para evitar choques.
- Monitorea logs (`backup_cron_completed`, `backup_restored`) en tu stack observability.
