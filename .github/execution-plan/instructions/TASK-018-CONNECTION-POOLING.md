# TASK-018: Connection Pooling y Gestión de Conexiones

## 📋 INFORMACIÓN

**ID**: TASK-018 | **Fase**: 2 | **Prioridad**: ALTA | **Estimación**: 2h

## 🎯 OBJETIVO

Implementar pool de conexiones eficiente para SQLite, gestionar modo WAL y optimizar concurrencia.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Connection Pool Manager

**Archivo**: `backend/src/db/connectionPool.ts`

```typescript
import Database from 'better-sqlite3';
import { logger } from '../config/logger.js';

interface PoolConfig {
  maxConnections: number;
  idleTimeout: number; // ms
  path: string;
}

export class ConnectionPool {
  private pool: Database[] = [];
  private inUse: Set<Database> = new Set();
  private config: PoolConfig;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<PoolConfig> = {}) {
    this.config = {
      maxConnections: config.maxConnections || 5,
      idleTimeout: config.idleTimeout || 60000, // 1 min
      path: config.path || './database.sqlite',
    };

    // Crear conexiones iniciales
    this.createConnection();
    
    // Cleanup de conexiones idle
    this.startCleanup();
  }

  private createConnection(): Database {
    const db = new Database(this.config.path);
    
    // Configuración WAL
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    db.pragma('cache_size = -64000');
    db.pragma('busy_timeout = 5000'); // 5s timeout
    
    logger.debug('New database connection created');
    return db;
  }

  async acquire(): Promise<Database> {
    // Intentar reutilizar conexión del pool
    if (this.pool.length > 0) {
      const db = this.pool.pop()!;
      this.inUse.add(db);
      return db;
    }

    // Crear nueva conexión si no alcanzamos el límite
    if (this.inUse.size < this.config.maxConnections) {
      const db = this.createConnection();
      this.inUse.add(db);
      return db;
    }

    // Esperar a que se libere una conexión
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.pool.length > 0) {
          clearInterval(checkInterval);
          const db = this.pool.pop()!;
          this.inUse.add(db);
          resolve(db);
        }
      }, 50);
    });
  }

  release(db: Database): void {
    if (this.inUse.has(db)) {
      this.inUse.delete(db);
      this.pool.push(db);
    }
  }

  async withConnection<T>(fn: (db: Database) => T): Promise<T> {
    const db = await this.acquire();
    try {
      return fn(db);
    } finally {
      this.release(db);
    }
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      
      // Cerrar conexiones idle
      while (this.pool.length > 1) {
        const db = this.pool.pop()!;
        db.close();
        logger.debug('Closed idle connection');
      }
    }, this.config.idleTimeout);
  }

  async close(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Cerrar todas las conexiones
    for (const db of [...this.pool, ...this.inUse]) {
      db.close();
    }

    this.pool = [];
    this.inUse.clear();
    
    logger.info('Connection pool closed');
  }

  getStats() {
    return {
      available: this.pool.length,
      inUse: this.inUse.size,
      total: this.pool.length + this.inUse.size,
      max: this.config.maxConnections,
    };
  }
}
```

### Paso 2: Singleton Pool Instance

**Archivo**: `backend/src/db/index.ts`

```typescript
import { ConnectionPool } from './connectionPool.js';

let poolInstance: ConnectionPool | null = null;

export function getConnectionPool(): ConnectionPool {
  if (!poolInstance) {
    poolInstance = new ConnectionPool({
      maxConnections: parseInt(process.env.DB_POOL_SIZE || '5'),
      idleTimeout: 60000,
      path: process.env.DATABASE_PATH || './database.sqlite',
    });
  }
  return poolInstance;
}

export async function closeConnectionPool(): Promise<void> {
  if (poolInstance) {
    await poolInstance.close();
    poolInstance = null;
  }
}
```

### Paso 3: Gestión WAL Checkpoint

**Archivo**: `backend/src/db/walManager.ts`

```typescript
import Database from 'better-sqlite3';
import { logger } from '../config/logger.js';

export class WALManager {
  private checkpointInterval: NodeJS.Timeout | null = null;

  constructor(private db: Database) {}

  /**
   * Ejecutar checkpoint manual
   */
  checkpoint(mode: 'PASSIVE' | 'FULL' | 'RESTART' | 'TRUNCATE' = 'PASSIVE'): void {
    try {
      const result = this.db.pragma(`wal_checkpoint(${mode})`);
      logger.info({ mode, result }, 'WAL checkpoint executed');
    } catch (error) {
      logger.error({ error }, 'WAL checkpoint failed');
    }
  }

  /**
   * Checkpoint automático cada 5 minutos
   */
  startAutoCheckpoint(intervalMs: number = 300000): void {
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

  /**
   * Obtener info de WAL
   */
  getWALInfo() {
    return {
      journalMode: this.db.pragma('journal_mode', { simple: true }),
      walCheckpoint: this.db.pragma('wal_checkpoint'),
      walAutoCheckpoint: this.db.pragma('wal_autocheckpoint', { simple: true }),
    };
  }
}
```

### Paso 4: Integrar Pool en Servicios

**Archivo**: `backend/src/services/ProductService.ts` (actualizar)

```typescript
import { getConnectionPool } from '../db/index.js';

export class ProductService {
  async getProducts(filters: any) {
    const pool = getConnectionPool();
    
    return pool.withConnection(db => {
      // Query con conexión del pool
      return db.prepare('SELECT * FROM products WHERE category = ?')
        .all(filters.category);
    });
  }
}
```

### Paso 5: Middleware de Pool Stats

**Archivo**: `backend/src/plugins/poolStats.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import { getConnectionPool } from '../db/index.js';

export const poolStatsPlugin: FastifyPluginAsync = async (fastify) => {
  // Endpoint para ver stats del pool
  fastify.get('/api/admin/pool-stats', {
    preHandler: [fastify.authenticate, fastify.authorizeAdmin],
  }, async () => {
    const pool = getConnectionPool();
    return pool.getStats();
  });

  // Hook para logging
  fastify.addHook('onRequest', async (request) => {
    const pool = getConnectionPool();
    const stats = pool.getStats();
    
    if (stats.inUse >= stats.max * 0.8) {
      fastify.log.warn({ stats }, 'Connection pool near capacity');
    }
  });
};
```

### Paso 6: Configuración .env

**Archivo**: `.env.example`

```bash
# Database Connection Pool
DB_POOL_SIZE=5
DATABASE_PATH=./database.sqlite
WAL_CHECKPOINT_INTERVAL=300000  # 5 minutes
```

### Paso 7: Graceful Shutdown

**Archivo**: `backend/src/server.ts`

```typescript
import { closeConnectionPool } from './db/index.js';

// Shutdown handler
async function gracefulShutdown(signal: string) {
  logger.info({ signal }, 'Received shutdown signal');
  
  try {
    // Cerrar pool de conexiones
    await closeConnectionPool();
    
    // Cerrar servidor Fastify
    await fastify.close();
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during shutdown');
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Connection pool con límite configurable
- [x] Modo WAL habilitado
- [x] Checkpoint automático
- [x] Graceful shutdown
- [x] Stats de pool disponibles
- [x] Timeout configurables

## 🧪 VALIDACIÓN

```bash
# Ver stats del pool
curl http://localhost:3000/api/admin/pool-stats

# Verificar WAL mode
sqlite3 database.sqlite "PRAGMA journal_mode"

# Monitorear archivos WAL
ls -lh database.sqlite*

# Load test
ab -n 1000 -c 10 http://localhost:3000/api/products
```

---

**Status**: COMPLETO ✅
