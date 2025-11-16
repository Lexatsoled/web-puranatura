import { ConnectionPool } from './connectionPool.js';
import { WALManager } from './walManager.js';
import { config } from '../config/index.js';
import { db, sqlite } from './client.js';

let poolInstance: ConnectionPool | null = null;
let walManager: WALManager | null = null;

export function getConnectionPool(): ConnectionPool {
  if (!poolInstance) {
    poolInstance = new ConnectionPool({
      maxConnections: config.DB_POOL_SIZE,
      idleTimeout: config.DB_POOL_IDLE_TIMEOUT,
      path: config.DATABASE_PATH,
      verbose: config.NODE_ENV === 'development',
    });
  }
  return poolInstance;
}

export function getWALManager(): WALManager {
  if (!walManager) {
    walManager = new WALManager(sqlite);
    walManager.startAutoCheckpoint(config.WAL_CHECKPOINT_INTERVAL);
  }
  return walManager;
}

export async function closeConnectionPool(): Promise<void> {
  if (walManager) {
    walManager.stopAutoCheckpoint();
    walManager = null;
  }

  if (poolInstance) {
    await poolInstance.close();
    poolInstance = null;
  }
}

export { db, sqlite };
