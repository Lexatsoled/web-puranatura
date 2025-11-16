#!/usr/bin/env tsx
import '../src/config/index.js';
import { backupService } from '../src/services/BackupService.js';

const [, , command = 'help', ...args] = process.argv;

async function run() {
  switch (command) {
    case 'create': {
      const type = args[0] === 'incremental' ? 'incremental' : 'full';
      const result = await backupService.createBackup(type);
      console.log('Backup creado:', result.backupPath);
      console.table(result.metadata);
      break;
    }
    case 'list': {
      const backups = await backupService.listBackups();
      if (!backups.length) {
        console.log('No hay backups disponibles.');
        break;
      }
      console.table(
        backups.map((backup) => ({
          timestamp: backup.timestamp,
          type: backup.type,
          size: `${(backup.size / (1024 * 1024)).toFixed(2)} MB`,
          path: backup.path,
          integrity: backup.integrityCheck,
        })),
      );
      break;
    }
    case 'restore': {
      const backupPath = args[0];
      if (!backupPath) {
        console.error('Uso: npm run backup:restore <ruta-backup>');
        process.exit(1);
      }
      await backupService.restoreBackup(backupPath);
      console.log('Base de datos restaurada correctamente.');
      break;
    }
    case 'check': {
      const ok = await backupService.checkIntegrity();
      console.log(ok ? 'Integrity check OK' : 'Integrity check FAILED');
      process.exit(ok ? 0 : 1);
      break;
    }
    default:
      console.log(`Comandos disponibles:
  npm run backup:create [full|incremental]
  npm run backup:list
  npm run backup:restore <ruta-backup>
  npm run backup:check`);
  }
}

run().catch((error) => {
  console.error('Error en herramienta de backups:', error);
  process.exit(1);
});
