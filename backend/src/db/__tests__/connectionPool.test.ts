import { describe, expect, it } from 'vitest';
import { ConnectionPool } from '../connectionPool.js';

describe('ConnectionPool', () => {
  it('reutiliza conexiones disponibles y actualiza stats', async () => {
    const pool = new ConnectionPool({
      maxConnections: 2,
      idleTimeout: 0,
      path: ':memory:',
    });

    const first = await pool.acquire();
    const second = await pool.acquire();

    expect(first).not.toBe(second);

    pool.release(first);
    pool.release(second);

    const stats = pool.getStats();
    expect(stats.available).toBe(2);
    expect(stats.inUse).toBe(0);

    await pool.close();
  });

  it('withConnection libera automaticamente la conexion', async () => {
    const pool = new ConnectionPool({
      maxConnections: 1,
      idleTimeout: 0,
      path: ':memory:',
    });

    const result = await pool.withConnection((db) => {
      db.exec('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT)');
      const stmt = db.prepare('INSERT INTO test (value) VALUES (?)');
      stmt.run('hola');
      return db.prepare('SELECT value FROM test WHERE id = 1').get() as { value: string };
    });

    expect(result.value).toBe('hola');
    expect(pool.getStats().available).toBe(1);

    await pool.close();
  });
});
