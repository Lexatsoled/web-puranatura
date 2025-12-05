# Runbook: Backups y Restore (SQLite + Secretos)

Objetivo: asegurar copias diarias del estado crítico (DB SQLite y carpeta `Secretos/`) y restauración verificada sin depender de SaaS.

## Alcance

- `backend/prisma/dev.db` (SQLite) en modo WAL.
- Carpeta `Secretos/` (gitignored) con claves y archivos sensibles.
- Logs y reports no son parte del backup estándar (opcional).

## Frecuencia

- Backup: diario (cron local) y previo a cambios de esquema.
- Restore test: mensual.

## Procedimiento de Backup (manual o cron)

1. Preparar carpeta destino (ej. `backups/` fuera del repo o en disco externo).
2. Poner DB en estado consistente:
   - Opción segura (recomendada): usar `VACUUM INTO` (no requiere parar server).
   - Opción fría: pausar la app y copiar archivos (ver comandos abajo).
3. Ejecutar backup:
   - Con `VACUUM INTO` o copia fría (según entorno).
4. Calcular hash para integridad.
5. (Opcional) Comprimir.
6. Verificar espacio y permisos del destino.

## Procedimiento de Restore (prueba mensual)

1. Elegir snapshot a probar (más reciente).
2. Restaurar a un entorno de prueba (no sobrescribir producción):
   - `cp backups/dev-YYYYMMDD.db backend/prisma/dev.db`
   - `cp -r backups/Secretos-YYYYMMDD Secretos`
3. Levantar backend en modo dev y correr smoke tests:
   - `npm run test:ci` o mínimo `npm run test -- backend.*`
   - Hacer login/consulta de productos manual o con curl.
4. Validar integridad:
   - Consultar `/api/health` y `/api/products`.
5. Descartar el entorno de prueba tras la verificación.

## Consideraciones de seguridad

- Mantener `Secretos/` fuera de git y cifrar los snapshots en repositorio externo si se mueven de máquina.
- Controlar permisos (700) en `backups/Secretos-*`.
- No subir backups a servicios externos sin cifrado previo.

## Automatización sugerida (sin implementarla aún)

- Script shell/Node que:
  - Cree carpeta `backups/$(date)`.
  - Copie DB y `Secretos/`, calcule hashes y genere manifiesto JSON (fecha, tamaños, hash).
  - Opción `--prune` para rotar backups (ej. mantener 7 diarios + 4 semanales).
- Integrar alerta local (log/console) si copia falla.
- Comando listo en repo: `npm run backup:safe` (usa VACUUM INTO con Prisma; requiere deps backend instaladas, genera por defecto `backups/dev-YYYYMMDD-HHMMSS.db`).
- Tarea programada recomendada:
  - Windows (Task Scheduler): `cmd /c "set DATABASE_URL=file:./prisma/dev.db && npm run backup:safe"` (madrugada, reintento 1 vez, retener ≥7 días en `backups/`).
  - Linux/macOS (cron): `0 3 * * * cd /ruta/al/repo && DATABASE_URL=file:./prisma/dev.db npm run backup:safe`, más tarea semanal opcional para purgar >7d.
- Purga automática (Windows): tarea semanal `Puranatura-Backups-Purge` ejecuta `Plan-mejora/purge-backups.cmd` (borra `.db` >7 días en `backups/`). Ajustar retención cambiando el `/d -7` en el script.

## Checks rápidos

- [ ] Backup diario creado.
- [ ] Hashes generados y almacenados.
- [ ] Restore test mensual ejecutado y documentado.

## Comandos para Windows (PowerShell)

### Backup frío (pausar app)

```powershell
$fecha = Get-Date -Format "yyyyMMdd"
New-Item -ItemType Directory -Path "backups" -Force | Out-Null
Copy-Item "backend/prisma/dev.db" -Destination "backups/dev-$fecha.db"
Copy-Item -Path "Secretos" -Destination "backups/Secretos-$fecha" -Recurse -Force
Get-FileHash "backups/dev-$fecha.db" -Algorithm SHA256 |
  Select-Object @{Name='File';Expression={Split-Path $_.Path -Leaf}}, Hash |
  Export-Csv "backups/hashes.csv" -Append -NoTypeInformation
# Opcional comprimir
Compress-Archive -Path "backups/dev-$fecha.db","backups/Secretos-$fecha" `
  -DestinationPath "backups/snapshot-$fecha.zip" -Force
```

### Backup seguro online (VACUUM INTO, sin parar app)

```powershell
$fecha = Get-Date -Format "yyyyMMdd"
New-Item -ItemType Directory -Path "backups" -Force | Out-Null
# Ejecutar comando SQLite desde Prisma/Node (ver script safe-backup.cjs)
node backend/scripts/safe-backup.cjs --out "backups/dev-$fecha.db"
Get-FileHash "backups/dev-$fecha.db" -Algorithm SHA256 |
  Select-Object @{Name='File';Expression={Split-Path $_.Path -Leaf}}, Hash |
  Export-Csv "backups/hashes.csv" -Append -NoTypeInformation
```

## Script sugerido (Node) para backup seguro (VACUUM INTO)

```js
// backend/scripts/safe-backup.cjs (ejemplo)
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const outArg = process.argv.find((a) => a.startsWith('--out='));
const outPath = outArg
  ? outArg.split('=')[1]
  : `backups/dev-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.db`;
fs.mkdirSync(path.dirname(outPath), { recursive: true });

async function main() {
  await prisma.$executeRawUnsafe(`VACUUM INTO '${outPath}'`);
  console.log(`[safe-backup] Backup creado: ${outPath}`);
  await prisma.$disconnect();
}
main().catch((err) => {
  console.error('[safe-backup] Error:', err);
  process.exit(1);
});
```
