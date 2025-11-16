import type { Database as BetterSqliteDatabase } from 'better-sqlite3';
import { logger } from '../config/logger.js';

type CheckpointMode = 'PASSIVE' | 'FULL' | 'RESTART' | 'TRUNCATE';

export class WALManager {
  private checkpointInterval: NodeJS.Timeout | null = null;

  constructor(private readonly db: BetterSqliteDatabase) {}

  checkpoint(mode: CheckpointMode = 'PASSIVE'): void {
    try {
      const result = this.db.pragma(`wal_checkpoint(${mode})`);
      logger.info({ mode, result }, 'WAL checkpoint executed');
    } catch (error) {
      logger.error({ error, mode }, 'WAL checkpoint failed');
    }
  }

  startAutoCheckpoint(intervalMs = 300000): void {
    if (intervalMs <= 0 || process.env.NODE_ENV === 'test') {
      return;
    }

    this.stopAutoCheckpoint();
    this.checkpointInterval = setInterval(() => {
      this.checkpoint('PASSIVE');
    }, intervalMs);
  }

  stopAutoCheckpoint(): void {
    if (this.checkpointInterval) {
      clearInterval(this.checkpointInterval);
      this.checkpointInterval = null;
    }
  }

  getWALInfo() {
    return {
      journalMode: this.db.pragma('journal_mode', { simple: true }),
      walCheckpoint: this.db.pragma('wal_checkpoint'),
      walAutoCheckpoint: this.db.pragma('wal_autocheckpoint', { simple: true }),
    };
  }
}
