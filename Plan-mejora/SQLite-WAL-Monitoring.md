# SQLite WAL y Monitoreo (dev/staging)

Objetivo: asegurar que SQLite opere en modo WAL con timeouts seguros, monitorear crecimiento/locks y ofrecer comandos simples (PowerShell) para checkpoint y verificación. Pensado para Windows/PowerShell sin Docker.

## Configuración activa (estado actual)

- Prisma `schema.prisma` usa `extensions = [wal]` (activa WAL).
- Backend aplica pragmas en arranque (ver `backend/src/prisma.ts`):
  - `journal_mode=wal`
  - `synchronous=normal` (equilibrio seguridad/rendimiento en dev/staging)
  - `busy_timeout=5000` ms (recomendado: 3000–8000 ms si hay más contención).
- Variables de entorno soportadas: `SQLITE_JOURNAL_MODE`, `SQLITE_SYNCHRONOUS`, `SQLITE_BUSY_TIMEOUT_MS` (defaults arriba).

## Verificación rápida (PowerShell)

1. Comprobar tamaños de archivos (db, wal, shm):

```powershell
Get-ChildItem "backend/prisma/dev.db*" |
  Select-Object Name,@{Name='SizeMB';Expression={[math]::Round($_.Length/1MB,2)}}
```

2. Leer pragmas (si tienes `sqlite3` en PATH):

```powershell
sqlite3 backend/prisma/dev.db "PRAGMA journal_mode; PRAGMA synchronous; PRAGMA busy_timeout; PRAGMA wal_checkpoint(PASSIVE);"
```

Alternativa sin sqlite3 (Node):

```powershell
node -e "const {PrismaClient}=require('@prisma/client');(async()=>{const p=new PrismaClient();console.log(await p.$queryRawUnsafe('PRAGMA journal_mode;'));console.log(await p.$queryRawUnsafe('PRAGMA synchronous;'));console.log(await p.$queryRawUnsafe('PRAGMA busy_timeout;'));await p.$disconnect();})();"
```

## Checkpoint / truncado seguro (cuando el WAL crezca)

- Ejecuta un checkpoint pasivo o truncado si `dev.db-wal` > ~256 MB o tras pruebas de carga:

```powershell
sqlite3 backend/prisma/dev.db "PRAGMA wal_checkpoint(TRUNCATE);"
```

- Luego verifica tamaños nuevamente. No hace falta detener el backend para checkpoints.

## Monitoreo mínimo sugerido

- Semanal: revisar tamaños de `dev.db*` y anotar si `dev.db-wal` o `dev.db-shm` crecen persistentemente.
- Mensual (o tras cargas intensas): `VACUUM INTO` mediante `npm run backup:safe` (genera snapshot compacto y limpia fragmentación).
- Alertas manuales:
  - Si ves errores `SQLITE_BUSY` repetidos en logs, sube `SQLITE_BUSY_TIMEOUT_MS` a 8000.
  - Si `dev.db` supera ~500 MB, considera `VACUUM INTO` y revisar índices.
- Health quick-check (opcional): `sqlite3 dev.db "PRAGMA integrity_check;"` tras un restore.

## Procedimiento de restauración y backups

- Usa `Runbook-Backups.md` para snapshot/restore (incluye comandos PowerShell seguros con WAL).
- Siempre copia los tres archivos (`.db`, `.db-wal`, `.db-shm`) o usa `VACUUM INTO` para obtener un solo archivo consistente antes de moverlo.

## Registro en plan

- Checklist Fase 2: marca “WAL + monitoreo documentado” cuando hayas confirmado tamaños y pragmas aplicados.
- Riesgos conocidos: bajo en dev/staging; en producción, vigilar espacio en disco y programar checkpoints si la carga de escritura crece.
