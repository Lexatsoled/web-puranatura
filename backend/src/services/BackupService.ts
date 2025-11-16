import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { createGzip, createGunzip } from 'zlib';
import { createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync } from 'crypto';
import { sqlite } from '../db/client.js';
import { logger } from '../config/logger.js';
import { config } from '../config/index.js';

const DEFAULT_DB_FILENAME = 'database.sqlite';

export interface BackupConfig {
  backupDir: string;
  dbPath: string;
  encryptionKey?: string;
  dailyRetention: number;
  monthlyRetention: number;
  compress: boolean;
}

export interface BackupMetadata {
  timestamp: string;
  type: 'full' | 'incremental';
  size: number;
  checksum: string;
  encrypted: boolean;
  compressed: boolean;
  integrityCheck: 'passed' | 'failed' | 'not_run';
  duration: number;
  tableCount: number;
  recordCount: number;
  path: string;
  encryptionIv?: string;
  encryptionAlgorithm?: string;
}

export interface BackupResult {
  success: boolean;
  backupPath: string;
  metadata: BackupMetadata;
  error?: string;
}

export class BackupService {
  private readonly backupDir: string;
  private readonly dbPath: string;
  private readonly encryptionKey?: Buffer;
  private readonly config: BackupConfig;
  private readonly encryptionAlgorithm = 'aes-256-cbc';

  constructor(options: BackupConfig) {
    this.config = options;
    this.backupDir = path.resolve(process.cwd(), options.backupDir);
    this.dbPath = this.resolveDatabasePath(options.dbPath);
    this.encryptionKey = options.encryptionKey
      ? scryptSync(options.encryptionKey, 'pureza-backup-salt', 32)
      : undefined;
  }

  async createBackup(type: 'full' | 'incremental' = 'full'): Promise<BackupResult> {
    const started = Date.now();
    await this.ensureDirectory(this.backupDir);

    const integrityPassed = await this.checkIntegrity();
    const { tableCount, recordCount } = this.collectStats();
    await this.flushDatabase();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseName = `${timestamp}-${type}`;
    let backupPath = path.join(this.backupDir, `${baseName}.sqlite`);

    const readStream = fs.createReadStream(this.dbPath);
    const transforms: NodeJS.ReadWriteStream[] = [];
    let encryptionIv: string | undefined;

    if (this.config.compress) {
      transforms.push(createGzip());
      backupPath += '.gz';
    }

    if (this.encryptionKey) {
      const iv = randomBytes(16);
      encryptionIv = iv.toString('hex');
      const cipher = createCipheriv(this.encryptionAlgorithm, this.encryptionKey, iv);
      transforms.push(cipher);
      backupPath += '.enc';
    }

    const writeStream = fs.createWriteStream(backupPath);

    await pipeline([readStream, ...transforms, writeStream] as any);

    const checksum = await this.calculateChecksum(backupPath);
    const stats = await fsp.stat(backupPath);

    const metadata: BackupMetadata = {
      timestamp: new Date().toISOString(),
      type,
      size: stats.size,
      checksum,
      encrypted: Boolean(this.encryptionKey),
      compressed: this.config.compress,
      integrityCheck: integrityPassed ? 'passed' : 'failed',
      duration: Date.now() - started,
      tableCount,
      recordCount,
      path: backupPath,
      ...(encryptionIv && { encryptionIv }),
      ...(this.encryptionKey && { encryptionAlgorithm: this.encryptionAlgorithm }),
    };

    await this.writeMetadata(backupPath, metadata);
    await this.rotateBackups();

    logger.info(
      {
        event: 'backup_created',
        path: backupPath,
        duration: metadata.duration,
        size: metadata.size,
      },
      'Backup created successfully',
    );

    return {
      success: true,
      backupPath,
      metadata,
    };
  }

  async listBackups(): Promise<BackupMetadata[]> {
    await this.ensureDirectory(this.backupDir);
    const files = await fsp.readdir(this.backupDir);
    const metadataFiles = files.filter((file) => file.endsWith('.meta.json'));
    const entries: BackupMetadata[] = [];

    for (const file of metadataFiles) {
      const content = await fsp.readFile(path.join(this.backupDir, file), 'utf8');
      try {
        const meta = JSON.parse(content) as BackupMetadata;
        entries.push(meta);
      } catch (error) {
        logger.warn({ file, error }, 'Failed to parse backup metadata');
      }
    }

    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async restoreBackup(backupPath: string): Promise<void> {
    const resolvedPath = this.resolveBackupPath(backupPath);
    const metadata = await this.readMetadata(resolvedPath);
    const tempRestorePath = path.join(this.backupDir, `${path.basename(resolvedPath)}.restore`);

    const transforms: NodeJS.ReadWriteStream[] = [];
    const readStream = fs.createReadStream(resolvedPath);

    if (metadata.encrypted) {
      if (!this.encryptionKey || !metadata.encryptionIv) {
        throw new Error('Backup encrypted pero falta BACKUP_ENCRYPTION_KEY o IV');
      }
      const iv = Buffer.from(metadata.encryptionIv, 'hex');
      const decipher = createDecipheriv(this.encryptionAlgorithm, this.encryptionKey, iv);
      transforms.push(decipher);
    }

    if (metadata.compressed) {
      transforms.push(createGunzip());
    }

    const writeStream = fs.createWriteStream(tempRestorePath);
    await pipeline([readStream, ...transforms, writeStream] as any);

    const safetyCopy = `${this.dbPath}.${Date.now()}.bak`;
    await fsp.copyFile(this.dbPath, safetyCopy);
    await fsp.copyFile(tempRestorePath, this.dbPath);
    await fsp.unlink(tempRestorePath);

    const isHealthy = await this.checkIntegrity();
    if (!isHealthy) {
      await fsp.copyFile(safetyCopy, this.dbPath);
      throw new Error('Integrity check failed after restore. Original database was restored.');
    }

    logger.info(
      {
        event: 'backup_restored',
        from: resolvedPath,
        safetyCopy,
      },
      'Database restored from backup',
    );
  }

  async checkIntegrity(): Promise<boolean> {
    try {
      const result = sqlite.prepare('PRAGMA integrity_check').get() as any;
      return result?.integrity_check === 'ok';
    } catch (error) {
      logger.error({ error }, 'Integrity check failed');
      return false;
    }
  }

  private async rotateBackups(): Promise<void> {
    const backups = await this.listBackups();
    const keep = new Set<string>();

    const daily = backups.slice(0, this.config.dailyRetention);
    daily.forEach((backup) => keep.add(backup.path));

    const monthlyBuckets = new Map<string, BackupMetadata>();
    for (const backup of backups.slice(this.config.dailyRetention)) {
      const monthKey = backup.timestamp.slice(0, 7); // YYYY-MM
      if (!monthlyBuckets.has(monthKey)) {
        monthlyBuckets.set(monthKey, backup);
      }
      if (monthlyBuckets.size >= this.config.monthlyRetention) {
        break;
      }
    }

    for (const backup of monthlyBuckets.values()) {
      keep.add(backup.path);
    }

    for (const backup of backups) {
      if (!keep.has(backup.path)) {
        await this.deleteBackupFiles(backup.path);
      }
    }
  }

  private async deleteBackupFiles(backupPath: string) {
    const metadataPath = this.getMetadataPath(backupPath);
    await Promise.allSettled([fsp.unlink(backupPath), fsp.unlink(metadataPath)]);
    logger.info({ backupPath }, 'Backup removed due to retention policy');
  }

  private async writeMetadata(backupPath: string, metadata: BackupMetadata) {
    const metadataPath = this.getMetadataPath(backupPath);
    await fsp.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  }

  private async readMetadata(backupPath: string): Promise<BackupMetadata> {
    const metadataPath = this.getMetadataPath(backupPath);
    const raw = await fsp.readFile(metadataPath, 'utf8');
    return JSON.parse(raw) as BackupMetadata;
  }

  private getMetadataPath(backupPath: string) {
    return `${backupPath}.meta.json`;
  }

  private async ensureDirectory(dir: string) {
    await fsp.mkdir(dir, { recursive: true });
  }

  private resolveBackupPath(filePath: string): string {
    if (path.isAbsolute(filePath)) {
      return filePath;
    }
    return path.join(this.backupDir, filePath);
  }

  private resolveDatabasePath(dbUrl: string): string {
    if (dbUrl.startsWith('file:')) {
      dbUrl = dbUrl.replace('file:', '');
    }
    if (!path.extname(dbUrl)) {
      return path.resolve(process.cwd(), DEFAULT_DB_FILENAME);
    }
    return path.resolve(process.cwd(), dbUrl);
  }

  private async flushDatabase() {
    try {
      sqlite.pragma('wal_checkpoint(TRUNCATE)');
      sqlite.pragma('optimize');
    } catch (error) {
      logger.warn({ error }, 'Failed to flush WAL before backup');
    }
  }

  private collectStats(): { tableCount: number; recordCount: number } {
    try {
      const tables = sqlite
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        .all() as Array<{ name: string }>;
      let recordCount = 0;
      for (const table of tables) {
        try {
          const stmt = sqlite.prepare(`SELECT COUNT(*) as count FROM "${table.name}"`);
          const { count } = stmt.get() as { count: number };
          recordCount += Number(count) || 0;
        } catch {
          // ignore counting errors per table
        }
      }
      return { tableCount: tables.length, recordCount };
    } catch (error) {
      logger.warn({ error }, 'Failed to collect table statistics');
      return { tableCount: 0, recordCount: 0 };
    }
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    const hash = createHash('sha256');
    const input = fs.createReadStream(filePath);
    await pipeline(input, hash);
    return hash.digest('hex');
  }
}

const backupService = new BackupService({
  backupDir: config.BACKUP_DIR,
  dbPath: config.DATABASE_URL,
  encryptionKey: config.BACKUP_ENCRYPTION_KEY,
  dailyRetention: config.BACKUP_DAILY_RETENTION,
  monthlyRetention: config.BACKUP_MONTHLY_RETENTION,
  compress: config.BACKUP_COMPRESS,
});

export { backupService };
