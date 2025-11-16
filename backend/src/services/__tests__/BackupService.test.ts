import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { promises as fsp } from 'fs';
import Database from 'better-sqlite3';
import { BackupService, BackupConfig } from '../BackupService';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-tests-'));
const dbFile = path.join(tempDir, 'test.sqlite');

const testConfig: BackupConfig = {
  backupDir: tempDir,
  dbPath: dbFile,
  encryptionKey: 'test_encryption_key_for_backups_123456789',
  dailyRetention: 5,
  monthlyRetention: 2,
  compress: true,
};

const backupService = new BackupService(testConfig);

beforeAll(() => {
  const db = new Database(dbFile);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
    INSERT INTO users (name) VALUES ('Alice'), ('Bob'), ('Charlie');
  `);
  db.close();
});

afterAll(async () => {
  await fsp.rm(tempDir, { recursive: true, force: true });
});

describe('BackupService', () => {
  it('creates encrypted compressed backups with metadata', async () => {
    const result = await backupService.createBackup('full');
    expect(result.success).toBe(true);
    expect(fs.existsSync(result.backupPath)).toBe(true);
    expect(result.metadata.encrypted).toBe(true);
    expect(result.metadata.compressed).toBe(true);
    expect(result.metadata.checksum).toMatch(/^[a-f0-9]{64}$/);
  });

  it('lists available backups', async () => {
    const backups = await backupService.listBackups();
    expect(backups.length).toBeGreaterThan(0);
  });

  it('verifies database integrity', async () => {
    const ok = await backupService.checkIntegrity();
    expect(ok).toBe(true);
  });

  it('restores from backup successfully', async () => {
    const backups = await backupService.listBackups();
    const latest = backups[0];
    await backupService.restoreBackup(latest.path);
    const ok = await backupService.checkIntegrity();
    expect(ok).toBe(true);
  });
});
