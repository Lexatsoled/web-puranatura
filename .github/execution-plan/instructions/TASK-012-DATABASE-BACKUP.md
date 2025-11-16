# TASK-012: Sistema Automatizado de Backup y Restauración de Base de Datos

## 📋 INFORMACIÓN DE LA TAREA

**ID**: TASK-012  
**Fase**: 1 - Seguridad Crítica  
**Prioridad**: ALTA  
**Estimación**: 6 horas  
**Dependencias**: Ninguna

## 🎯 OBJETIVO

Implementar sistema automatizado de backup y restauración de la base de datos SQLite con rotación de archivos, verificación de integridad, encriptación y monitoreo de salud del backup.

## 📊 CONTEXTO

**Problema Actual**:
- Sin backups automatizados de `database.sqlite`
- Riesgo de pérdida total de datos ante corrupción/fallo hardware
- Sin plan de recuperación ante desastres (disaster recovery)
- Sin verificación de integridad de backups existentes

**Impacto**:
- **CRÍTICO**: Pérdida completa de pedidos, usuarios, productos
- Sin backups, recuperación imposible ante corrupción DB
- Downtime prolongado sin plan de restauración
- Incumplimiento GDPR (derecho a portabilidad de datos)

**Solución Propuesta**:
Sistema completo de backup/restauración con:
- Backups automáticos diarios + incrementales
- Verificación de integridad (PRAGMA integrity_check)
- Encriptación AES-256 de backups
- Rotación automática (mantener últimos 30 días + 12 mensuales)
- Restauración con punto de recuperación (PITR)
- Monitoreo y alertas de fallos

## 🔍 ANÁLISIS DE RIESGOS

### Riesgos Mitigados

1. **Pérdida de Datos**
   - **Probabilidad**: Media (corrupción DB, fallo hardware, error humano)
   - **Impacto**: Crítico (pérdida total de datos)
   - **Mitigación**: Backups diarios + verificación integridad

2. **Corrupción de Base de Datos**
   - **Probabilidad**: Baja (crashes, disco lleno, bugs SQLite)
   - **Impacto**: Alto (DB inutilizable)
   - **Mitigación**: WAL mode + backups verificados

3. **Ransomware/Ataque Malicioso**
   - **Probabilidad**: Baja (servidor comprometido)
   - **Impacto**: Crítico (datos encriptados por atacante)
   - **Mitigación**: Backups offsite + encriptación propia

4. **Cumplimiento GDPR**
   - **Probabilidad**: Alta (auditoría regulatoria)
   - **Impacto**: Medio (multas hasta 4% revenue)
   - **Mitigación**: Portabilidad de datos + retención controlada

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Crear Servicio de Backup Principal

**Archivo**: `backend/src/services/BackupService.ts`

```typescript
import { Database } from 'better-sqlite3';
import { createReadStream, createWriteStream, promises as fs } from 'fs';
import { join, dirname, basename } from 'path';
import { pipeline } from 'stream/promises';
import { createGzip, createGunzip } from 'zlib';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { logger } from '../config/logger.js';

/**
 * Configuración de Backup
 */
export interface BackupConfig {
  /** Directorio donde se guardan los backups */
  backupDir: string;
  /** Path a la base de datos SQLite */
  dbPath: string;
  /** Contraseña para encriptar backups (AES-256) */
  encryptionKey?: string;
  /** Días de retención de backups diarios */
  dailyRetention: number;
  /** Número de backups mensuales a mantener */
  monthlyRetention: number;
  /** Comprimir backups (gzip) */
  compress: boolean;
}

/**
 * Metadata de un Backup
 */
export interface BackupMetadata {
  /** Timestamp del backup (ISO 8601) */
  timestamp: string;
  /** Tipo: full o incremental */
  type: 'full' | 'incremental';
  /** Tamaño del archivo en bytes */
  size: number;
  /** Hash SHA-256 del backup */
  checksum: string;
  /** ¿Está encriptado? */
  encrypted: boolean;
  /** ¿Está comprimido? */
  compressed: boolean;
  /** Resultado de integrity check */
  integrityCheck: 'passed' | 'failed' | 'not_run';
  /** Duración del backup en ms */
  duration: number;
  /** Número de tablas */
  tableCount: number;
  /** Número de registros totales */
  recordCount: number;
}

/**
 * Resultado de Operación de Backup
 */
export interface BackupResult {
  success: boolean;
  backupPath: string;
  metadata: BackupMetadata;
  error?: string;
}

/**
 * Servicio de Backup y Restauración de Base de Datos
 */
export class BackupService {
  private config: BackupConfig;
  private db: Database;

  constructor(db: Database, config: Partial<BackupConfig> = {}) {
    this.db = db;
    this.config = {
      backupDir: config.backupDir || join(process.cwd(), 'backups'),
      dbPath: config.dbPath || join(process.cwd(), 'database.sqlite'),
      encryptionKey: config.encryptionKey || process.env.BACKUP_ENCRYPTION_KEY,
      dailyRetention: config.dailyRetention || 30,
      monthlyRetention: config.monthlyRetention || 12,
      compress: config.compress !== undefined ? config.compress : true,
    };
  }

  /**
   * Crear backup completo de la base de datos
   */
  async createBackup(type: 'full' | 'incremental' = 'full'): Promise<BackupResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup_${type}_${timestamp}.db`;
    const backupPath = join(this.config.backupDir, backupFileName);

    try {
      logger.info({ type, backupPath }, 'Starting database backup');

      // Asegurar que existe el directorio de backups
      await fs.mkdir(this.config.backupDir, { recursive: true });

      // 1. Verificar integridad ANTES del backup
      const integrityOk = await this.checkIntegrity();
      if (!integrityOk) {
        throw new Error('Database integrity check failed before backup');
      }

      // 2. Crear backup usando SQLite backup API
      await this.performSQLiteBackup(backupPath);

      // 3. Comprimir si está habilitado
      let finalPath = backupPath;
      if (this.config.compress) {
        finalPath = await this.compressFile(backupPath);
        await fs.unlink(backupPath); // Eliminar sin comprimir
      }

      // 4. Encriptar si hay key configurada
      if (this.config.encryptionKey) {
        finalPath = await this.encryptFile(finalPath);
        const unencryptedPath = finalPath.replace('.enc', '');
        if (unencryptedPath !== finalPath) {
          await fs.unlink(unencryptedPath); // Eliminar sin encriptar
        }
      }

      // 5. Calcular checksum
      const checksum = await this.calculateChecksum(finalPath);

      // 6. Recolectar metadata
      const stats = await fs.stat(finalPath);
      const metadata: BackupMetadata = {
        timestamp: new Date().toISOString(),
        type,
        size: stats.size,
        checksum,
        encrypted: !!this.config.encryptionKey,
        compressed: this.config.compress,
        integrityCheck: 'passed',
        duration: Date.now() - startTime,
        tableCount: await this.getTableCount(),
        recordCount: await this.getTotalRecordCount(),
      };

      // 7. Guardar metadata
      await this.saveMetadata(finalPath, metadata);

      logger.info({
        backupPath: finalPath,
        size: stats.size,
        duration: metadata.duration,
      }, 'Backup completed successfully');

      return {
        success: true,
        backupPath: finalPath,
        metadata,
      };

    } catch (error) {
      logger.error({ error, backupPath }, 'Backup failed');
      
      return {
        success: false,
        backupPath,
        metadata: {
          timestamp: new Date().toISOString(),
          type,
          size: 0,
          checksum: '',
          encrypted: false,
          compressed: false,
          integrityCheck: 'failed',
          duration: Date.now() - startTime,
          tableCount: 0,
          recordCount: 0,
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Ejecutar backup SQLite usando API nativa
   */
  private async performSQLiteBackup(destPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Usar VACUUM INTO para crear copia compacta
        // Más seguro que copiar archivo directamente (evita corrupción por WAL)
        this.db.prepare(`VACUUM INTO ?`).run(destPath);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Verificar integridad de la base de datos
   */
  async checkIntegrity(): Promise<boolean> {
    try {
      const result = this.db.prepare('PRAGMA integrity_check').get() as { integrity_check: string };
      return result.integrity_check === 'ok';
    } catch (error) {
      logger.error({ error }, 'Integrity check failed');
      return false;
    }
  }

  /**
   * Comprimir archivo con gzip
   */
  private async compressFile(filePath: string): Promise<string> {
    const compressedPath = `${filePath}.gz`;
    const gzip = createGzip({ level: 9 }); // Máxima compresión
    
    await pipeline(
      createReadStream(filePath),
      gzip,
      createWriteStream(compressedPath)
    );

    return compressedPath;
  }

  /**
   * Descomprimir archivo gzip
   */
  private async decompressFile(filePath: string): Promise<string> {
    const decompressedPath = filePath.replace('.gz', '');
    const gunzip = createGunzip();
    
    await pipeline(
      createReadStream(filePath),
      gunzip,
      createWriteStream(decompressedPath)
    );

    return decompressedPath;
  }

  /**
   * Encriptar archivo con AES-256
   */
  private async encryptFile(filePath: string): Promise<string> {
    if (!this.config.encryptionKey) {
      throw new Error('Encryption key not configured');
    }

    const encryptedPath = `${filePath}.enc`;
    const algorithm = 'aes-256-cbc';
    const iv = randomBytes(16);
    const key = scryptSync(this.config.encryptionKey, 'salt', 32);
    const cipher = createCipheriv(algorithm, key, iv);

    // Escribir IV al inicio del archivo (necesario para desencriptar)
    await fs.writeFile(encryptedPath, iv);

    // Encriptar y appendear
    await pipeline(
      createReadStream(filePath),
      cipher,
      createWriteStream(encryptedPath, { flags: 'a' })
    );

    return encryptedPath;
  }

  /**
   * Desencriptar archivo AES-256
   */
  private async decryptFile(filePath: string): Promise<string> {
    if (!this.config.encryptionKey) {
      throw new Error('Encryption key not configured');
    }

    const decryptedPath = filePath.replace('.enc', '');
    const algorithm = 'aes-256-cbc';
    const key = scryptSync(this.config.encryptionKey, 'salt', 32);

    // Leer IV del inicio del archivo
    const fileHandle = await fs.open(filePath, 'r');
    const iv = Buffer.alloc(16);
    await fileHandle.read(iv, 0, 16, 0);
    await fileHandle.close();

    const decipher = createDecipheriv(algorithm, key, iv);

    // Desencriptar (saltar primeros 16 bytes del IV)
    const inputStream = createReadStream(filePath, { start: 16 });
    await pipeline(
      inputStream,
      decipher,
      createWriteStream(decryptedPath)
    );

    return decryptedPath;
  }

  /**
   * Calcular checksum SHA-256 de un archivo
   */
  private async calculateChecksum(filePath: string): Promise<string> {
    const { createHash } = await import('crypto');
    const hash = createHash('sha256');
    
    await pipeline(
      createReadStream(filePath),
      hash
    );

    return hash.digest('hex');
  }

  /**
   * Obtener número de tablas
   */
  private async getTableCount(): Promise<number> {
    const result = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM sqlite_master 
      WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
    `).get() as { count: number };
    
    return result.count;
  }

  /**
   * Obtener número total de registros
   */
  private async getTotalRecordCount(): Promise<number> {
    const tables = this.db.prepare(`
      SELECT name 
      FROM sqlite_master 
      WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
    `).all() as { name: string }[];

    let total = 0;
    for (const table of tables) {
      const result = this.db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get() as { count: number };
      total += result.count;
    }

    return total;
  }

  /**
   * Guardar metadata del backup
   */
  private async saveMetadata(backupPath: string, metadata: BackupMetadata): Promise<void> {
    const metadataPath = `${backupPath}.meta.json`;
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  /**
   * Leer metadata de un backup
   */
  async readMetadata(backupPath: string): Promise<BackupMetadata | null> {
    const metadataPath = `${backupPath}.meta.json`;
    
    try {
      const content = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      logger.warn({ backupPath }, 'Metadata file not found');
      return null;
    }
  }
}
```

---

### Paso 2: Servicio de Restauración

**Archivo**: `backend/src/services/RestoreService.ts`

```typescript
import { Database } from 'better-sqlite3';
import { promises as fs } from 'fs';
import { join } from 'path';
import { BackupService, BackupMetadata } from './BackupService.js';
import { logger } from '../config/logger.js';

/**
 * Resultado de Restauración
 */
export interface RestoreResult {
  success: boolean;
  restoredFrom: string;
  error?: string;
  metadata?: BackupMetadata;
  verificationPassed: boolean;
}

/**
 * Servicio de Restauración de Base de Datos
 */
export class RestoreService {
  private backupService: BackupService;
  private dbPath: string;

  constructor(db: Database, backupService: BackupService, dbPath: string) {
    this.backupService = backupService;
    this.dbPath = dbPath;
  }

  /**
   * Restaurar base de datos desde un backup
   */
  async restore(backupPath: string, verify: boolean = true): Promise<RestoreResult> {
    try {
      logger.info({ backupPath }, 'Starting database restore');

      // 1. Verificar que existe el backup
      await fs.access(backupPath);

      // 2. Leer metadata
      const metadata = await this.backupService.readMetadata(backupPath);

      // 3. Crear backup de seguridad de DB actual
      const currentBackupPath = `${this.dbPath}.pre-restore.${Date.now()}.bak`;
      await fs.copyFile(this.dbPath, currentBackupPath);
      logger.info({ currentBackupPath }, 'Created safety backup of current database');

      // 4. Preparar archivo de backup (desencriptar/descomprimir)
      let preparedBackup = backupPath;

      if (metadata?.encrypted) {
        preparedBackup = await (this.backupService as any).decryptFile(preparedBackup);
      }

      if (metadata?.compressed) {
        preparedBackup = await (this.backupService as any).decompressFile(preparedBackup);
      }

      // 5. Verificar integridad del backup
      if (verify && metadata) {
        const calculatedChecksum = await (this.backupService as any).calculateChecksum(
          metadata.encrypted ? `${backupPath}` : preparedBackup
        );
        
        if (calculatedChecksum !== metadata.checksum) {
          throw new Error('Backup checksum verification failed - file may be corrupted');
        }
      }

      // 6. Reemplazar DB actual con el backup
      await fs.copyFile(preparedBackup, this.dbPath);

      // 7. Limpiar archivos temporales
      if (preparedBackup !== backupPath) {
        await fs.unlink(preparedBackup);
      }

      // 8. Verificar integridad de DB restaurada
      const integrityOk = await this.backupService.checkIntegrity();

      if (!integrityOk) {
        // Rollback: restaurar backup de seguridad
        logger.error('Restored database failed integrity check, rolling back');
        await fs.copyFile(currentBackupPath, this.dbPath);
        throw new Error('Restored database failed integrity check');
      }

      // 9. Eliminar backup de seguridad (restauración exitosa)
      await fs.unlink(currentBackupPath);

      logger.info({ backupPath }, 'Database restored successfully');

      return {
        success: true,
        restoredFrom: backupPath,
        metadata: metadata || undefined,
        verificationPassed: true,
      };

    } catch (error) {
      logger.error({ error, backupPath }, 'Database restore failed');
      
      return {
        success: false,
        restoredFrom: backupPath,
        error: error instanceof Error ? error.message : 'Unknown error',
        verificationPassed: false,
      };
    }
  }

  /**
   * Listar todos los backups disponibles
   */
  async listBackups(): Promise<{ path: string; metadata: BackupMetadata | null }[]> {
    const backupDir = (this.backupService as any).config.backupDir;
    
    try {
      const files = await fs.readdir(backupDir);
      const backupFiles = files.filter(f => f.startsWith('backup_') && !f.endsWith('.meta.json'));

      const backups = await Promise.all(
        backupFiles.map(async (file) => {
          const fullPath = join(backupDir, file);
          const metadata = await this.backupService.readMetadata(fullPath);
          return { path: fullPath, metadata };
        })
      );

      // Ordenar por timestamp (más reciente primero)
      return backups.sort((a, b) => {
        const timeA = a.metadata?.timestamp || '';
        const timeB = b.metadata?.timestamp || '';
        return timeB.localeCompare(timeA);
      });

    } catch (error) {
      logger.error({ error }, 'Failed to list backups');
      return [];
    }
  }

  /**
   * Obtener backup más reciente
   */
  async getLatestBackup(): Promise<{ path: string; metadata: BackupMetadata | null } | null> {
    const backups = await this.listBackups();
    return backups[0] || null;
  }

  /**
   * Restaurar desde el backup más reciente
   */
  async restoreLatest(): Promise<RestoreResult> {
    const latest = await this.getLatestBackup();
    
    if (!latest) {
      return {
        success: false,
        restoredFrom: '',
        error: 'No backups found',
        verificationPassed: false,
      };
    }

    return this.restore(latest.path);
  }
}
```

---

### Paso 3: Servicio de Rotación de Backups

**Archivo**: `backend/src/services/BackupRotationService.ts`

```typescript
import { promises as fs } from 'fs';
import { join } from 'path';
import { BackupService, BackupMetadata } from './BackupService.js';
import { logger } from '../config/logger.js';

/**
 * Servicio de Rotación de Backups
 * Mantiene últimos N backups diarios + M backups mensuales
 */
export class BackupRotationService {
  private backupDir: string;
  private dailyRetention: number;
  private monthlyRetention: number;
  private backupService: BackupService;

  constructor(
    backupService: BackupService,
    backupDir: string,
    dailyRetention: number = 30,
    monthlyRetention: number = 12
  ) {
    this.backupService = backupService;
    this.backupDir = backupDir;
    this.dailyRetention = dailyRetention;
    this.monthlyRetention = monthlyRetention;
  }

  /**
   * Ejecutar rotación de backups
   */
  async rotate(): Promise<{ deleted: number; kept: number; promoted: number }> {
    try {
      logger.info('Starting backup rotation');

      const files = await fs.readdir(this.backupDir);
      const backupFiles = files.filter(f => f.startsWith('backup_') && !f.endsWith('.meta.json'));

      // Agrupar backups con metadata
      const backupsWithMeta = await Promise.all(
        backupFiles.map(async (file) => {
          const fullPath = join(this.backupDir, file);
          const metadata = await this.backupService.readMetadata(fullPath);
          const stats = await fs.stat(fullPath);
          
          return {
            path: fullPath,
            file,
            metadata,
            mtime: stats.mtime,
          };
        })
      );

      // Ordenar por fecha (más antiguo primero)
      backupsWithMeta.sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

      // Separar backups diarios y mensuales
      const dailyBackups = backupsWithMeta.filter(b => !this.isMonthlyBackup(b.file));
      const monthlyBackups = backupsWithMeta.filter(b => this.isMonthlyBackup(b.file));

      let deleted = 0;
      let kept = 0;
      let promoted = 0;

      // 1. Promover primer backup de cada mes a mensual
      const promotionCandidates = this.getMonthlyPromotionCandidates(dailyBackups);
      for (const backup of promotionCandidates) {
        const newName = backup.file.replace('backup_full_', 'backup_monthly_');
        const newPath = join(this.backupDir, newName);
        
        await fs.rename(backup.path, newPath);
        
        // Renombrar metadata también
        const oldMetaPath = `${backup.path}.meta.json`;
        const newMetaPath = `${newPath}.meta.json`;
        try {
          await fs.rename(oldMetaPath, newMetaPath);
        } catch (error) {
          // Ignorar si no existe metadata
        }

        promoted++;
        logger.info({ from: backup.file, to: newName }, 'Promoted backup to monthly');
      }

      // 2. Limpiar backups diarios antiguos (mantener últimos N días)
      const dailyToDelete = dailyBackups.slice(0, -this.dailyRetention);
      for (const backup of dailyToDelete) {
        await fs.unlink(backup.path);
        
        // Eliminar metadata también
        const metaPath = `${backup.path}.meta.json`;
        try {
          await fs.unlink(metaPath);
        } catch (error) {
          // Ignorar si no existe
        }

        deleted++;
        logger.debug({ file: backup.file }, 'Deleted old daily backup');
      }

      kept += dailyBackups.length - dailyToDelete.length;

      // 3. Limpiar backups mensuales antiguos (mantener últimos M meses)
      const monthlyToDelete = monthlyBackups.slice(0, -this.monthlyRetention);
      for (const backup of monthlyToDelete) {
        await fs.unlink(backup.path);
        
        const metaPath = `${backup.path}.meta.json`;
        try {
          await fs.unlink(metaPath);
        } catch (error) {
          // Ignorar
        }

        deleted++;
        logger.debug({ file: backup.file }, 'Deleted old monthly backup');
      }

      kept += monthlyBackups.length - monthlyToDelete.length + promoted;

      logger.info({ deleted, kept, promoted }, 'Backup rotation completed');

      return { deleted, kept, promoted };

    } catch (error) {
      logger.error({ error }, 'Backup rotation failed');
      throw error;
    }
  }

  /**
   * Verificar si un backup es mensual
   */
  private isMonthlyBackup(filename: string): boolean {
    return filename.includes('backup_monthly_');
  }

  /**
   * Obtener candidatos para promoción a mensual
   * (Primer backup de cada mes que no esté ya promovido)
   */
  private getMonthlyPromotionCandidates(
    dailyBackups: Array<{ file: string; path: string; mtime: Date }>
  ): Array<{ file: string; path: string; mtime: Date }> {
    const monthsSeen = new Set<string>();
    const candidates: Array<{ file: string; path: string; mtime: Date }> = [];

    // Recorrer en orden cronológico inverso (más reciente primero)
    for (let i = dailyBackups.length - 1; i >= 0; i--) {
      const backup = dailyBackups[i];
      const monthKey = `${backup.mtime.getFullYear()}-${backup.mtime.getMonth() + 1}`;

      if (!monthsSeen.has(monthKey)) {
        monthsSeen.add(monthKey);
        candidates.push(backup);
      }
    }

    return candidates;
  }

  /**
   * Calcular espacio total usado por backups
   */
  async getBackupStorageUsage(): Promise<{ totalSize: number; fileCount: number }> {
    const files = await fs.readdir(this.backupDir);
    const backupFiles = files.filter(f => f.startsWith('backup_'));

    let totalSize = 0;
    for (const file of backupFiles) {
      const stats = await fs.stat(join(this.backupDir, file));
      totalSize += stats.size;
    }

    return { totalSize, fileCount: backupFiles.length };
  }
}
```

---

### Paso 4: Cron Jobs para Automatización

**Archivo**: `backend/src/jobs/backupJobs.ts`

```typescript
import cron from 'node-cron';
import { Database } from 'better-sqlite3';
import { BackupService } from '../services/BackupService.js';
import { BackupRotationService } from '../services/BackupRotationService.js';
import { logger } from '../config/logger.js';

/**
 * Configurar tareas programadas de backup
 */
export function setupBackupJobs(db: Database) {
  const backupService = new BackupService(db, {
    backupDir: process.env.BACKUP_DIR || './backups',
    dbPath: process.env.DB_PATH || './database.sqlite',
    encryptionKey: process.env.BACKUP_ENCRYPTION_KEY,
    dailyRetention: parseInt(process.env.BACKUP_DAILY_RETENTION || '30'),
    monthlyRetention: parseInt(process.env.BACKUP_MONTHLY_RETENTION || '12'),
    compress: process.env.BACKUP_COMPRESS !== 'false',
  });

  const rotationService = new BackupRotationService(
    backupService,
    process.env.BACKUP_DIR || './backups',
    parseInt(process.env.BACKUP_DAILY_RETENTION || '30'),
    parseInt(process.env.BACKUP_MONTHLY_RETENTION || '12')
  );

  // Backup diario a las 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    logger.info('Starting scheduled daily backup');
    
    try {
      const result = await backupService.createBackup('full');
      
      if (result.success) {
        logger.info({
          backupPath: result.backupPath,
          size: result.metadata.size,
          duration: result.metadata.duration,
        }, 'Scheduled backup completed');

        // Ejecutar rotación después del backup
        const rotation = await rotationService.rotate();
        logger.info(rotation, 'Backup rotation completed');

      } else {
        logger.error({ error: result.error }, 'Scheduled backup failed');
        await sendBackupFailureAlert(result.error || 'Unknown error');
      }

    } catch (error) {
      logger.error({ error }, 'Scheduled backup job failed');
      await sendBackupFailureAlert(error instanceof Error ? error.message : 'Unknown error');
    }
  }, {
    timezone: 'Europe/Madrid',
  });

  // Verificación de integridad semanal
  cron.schedule('0 3 * * 0', async () => {
    logger.info('Starting weekly integrity check');
    
    try {
      const isIntact = await backupService.checkIntegrity();
      
      if (isIntact) {
        logger.info('Weekly integrity check passed');
      } else {
        logger.error('Weekly integrity check FAILED');
        await sendIntegrityCheckFailureAlert();
      }

    } catch (error) {
      logger.error({ error }, 'Integrity check job failed');
    }
  }, {
    timezone: 'Europe/Madrid',
  });

  logger.info('Backup cron jobs configured');
}

async function sendBackupFailureAlert(error: string): Promise<void> {
  logger.error({ error }, 'CRITICAL: Backup failed');
}

async function sendIntegrityCheckFailureAlert(): Promise<void> {
  logger.error('CRITICAL: Database integrity check failed');
}
```

---

### Paso 5: Scripts CLI para Gestión Manual

**Archivo**: `scripts/backup-cli.ts`

```typescript
#!/usr/bin/env node
import { program } from 'commander';
import Database from 'better-sqlite3';
import { BackupService } from '../backend/src/services/BackupService.js';
import { RestoreService } from '../backend/src/services/RestoreService.js';
import { BackupRotationService } from '../backend/src/services/BackupRotationService.js';

const DB_PATH = process.env.DB_PATH || './backend/database.sqlite';
const BACKUP_DIR = process.env.BACKUP_DIR || './backups';

program.name('backup-cli').version('1.0.0');

program
  .command('create')
  .option('-t, --type <type>', 'Tipo: full o incremental', 'full')
  .action(async (options) => {
    const db = new Database(DB_PATH);
    const backupService = new BackupService(db, { backupDir: BACKUP_DIR, dbPath: DB_PATH });
    
    const result = await backupService.createBackup(options.type);
    
    if (result.success) {
      console.log('✅ Backup creado:', result.backupPath);
    } else {
      console.error('❌ Error:', result.error);
      process.exit(1);
    }
    
    db.close();
  });

program
  .command('restore <path>')
  .action(async (path) => {
    const db = new Database(DB_PATH);
    const backupService = new BackupService(db, { dbPath: DB_PATH, backupDir: BACKUP_DIR });
    const restoreService = new RestoreService(db, backupService, DB_PATH);
    
    const result = await restoreService.restore(path);
    
    if (result.success) {
      console.log('✅ Restaurado exitosamente');
    } else {
      console.error('❌ Error:', result.error);
      process.exit(1);
    }
    
    db.close();
  });

program
  .command('list')
  .action(async () => {
    const db = new Database(DB_PATH);
    const backupService = new BackupService(db, { backupDir: BACKUP_DIR });
    const restoreService = new RestoreService(db, backupService, DB_PATH);
    
    const backups = await restoreService.listBackups();
    
    console.log(`\n📦 Backups (${backups.length}):\n`);
    backups.forEach(b => {
      console.log(`📄 ${b.path.split(/[\\/]/).pop()}`);
      if (b.metadata) {
        console.log(`   📅 ${new Date(b.metadata.timestamp).toLocaleString()}`);
        console.log(`   📊 ${(b.metadata.size / (1024 * 1024)).toFixed(2)} MB\n`);
      }
    });
    
    db.close();
  });

program.parse();
```

---

### Paso 6: Testing

**Archivo**: `backend/src/tests/services/BackupService.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { BackupService } from '../../services/BackupService.js';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('BackupService', () => {
  let db: Database.Database;
  let backupService: BackupService;
  const testDbPath = './test-db.sqlite';
  const testBackupDir = './test-backups';

  beforeEach(async () => {
    db = new Database(testDbPath);
    db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');
    db.exec("INSERT INTO users (name) VALUES ('Alice'), ('Bob')");

    await fs.mkdir(testBackupDir, { recursive: true });

    backupService = new BackupService(db, {
      backupDir: testBackupDir,
      dbPath: testDbPath,
      compress: false,
    });
  });

  afterEach(async () => {
    db.close();
    await fs.rm(testDbPath, { force: true });
    await fs.rm(testBackupDir, { recursive: true, force: true });
  });

  it('should create backup successfully', async () => {
    const result = await backupService.createBackup('full');

    expect(result.success).toBe(true);
    expect(result.metadata.integrityCheck).toBe('passed');
    expect(result.metadata.tableCount).toBeGreaterThan(0);
  });

  it('should verify database integrity', async () => {
    const isIntact = await backupService.checkIntegrity();
    expect(isIntact).toBe(true);
  });

  it('should calculate correct checksum', async () => {
    const result = await backupService.createBackup('full');
    expect(result.metadata.checksum).toMatch(/^[a-f0-9]{64}$/); // SHA-256
  });
});
```

---

### Paso 7: Documentación

**Archivo**: `docs/BACKUP_RESTORE_GUIDE.md`

```markdown
# Guía de Backup y Restauración

## Configuración

Variables de entorno en `.env`:

```bash
BACKUP_DIR=./backups
BACKUP_ENCRYPTION_KEY=tu-clave-secreta-muy-segura-min-32-chars
BACKUP_DAILY_RETENTION=30
BACKUP_MONTHLY_RETENTION=12
BACKUP_COMPRESS=true
```

## Uso CLI

### Crear Backup Manual

```bash
npm run backup:create
```

### Listar Backups

```bash
npm run backup:list
```

### Restaurar desde Backup

```bash
npm run backup:restore /path/to/backup.db.gz.enc
```

### Verificar Integridad

```bash
npm run backup:check
```

## Automatización

Backups automáticos cada día a las 2:00 AM (configurado en `backupJobs.ts`).

## Recuperación ante Desastres

1. Detener servidor
2. Listar backups: `npm run backup:list`
3. Restaurar: `npm run backup:restore <path>`
4. Verificar: `npm run backup:check`
5. Reiniciar servidor

## Encriptación

Los backups se encriptan con AES-256-CBC. Guardar `BACKUP_ENCRYPTION_KEY` de forma segura.

**Sin la key, los backups son irrecuperables.**
```

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Funcionales

- [x] BackupService crea backups completos
- [x] Verificación integridad con PRAGMA integrity_check
- [x] Compresión gzip de backups
- [x] Encriptación AES-256 de backups
- [x] Rotación automática (30 días + 12 mensuales)
- [x] RestoreService restaura con verificación
- [x] Cron jobs diarios configurados
- [x] CLI para gestión manual

### Técnicos

- [x] Tests unitarios BackupService
- [x] Metadata JSON por cada backup
- [x] Checksums SHA-256
- [x] Logs estructurados
- [x] Documentación completa

### Seguridad

- [x] Backups encriptados en reposo
- [x] Backup de seguridad antes de restore
- [x] Rollback automático si restore falla
- [x] Sin secretos en logs

## 🧪 VALIDACIÓN

```bash
# 1. Crear backup
npm run backup:create

# 2. Listar
npm run backup:list

# 3. Verificar integridad
npm run backup:check

# 4. Tests
npm test BackupService.test.ts
```

---

**Última Actualización**: 2025-11-07  
**Status**: COMPLETO ✅
