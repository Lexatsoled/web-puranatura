import Database from 'better-sqlite3';

export type CreateDatabaseOptions = Database.Options;

export function createOptimizedDatabase(path: string, options?: CreateDatabaseOptions) {
  const db = new Database(path, options);

  db.pragma('encoding = "UTF-8"');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');

  // Performance oriented pragmas
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('cache_size = -64000'); // 64MB cache
  db.pragma('temp_store = MEMORY');
  db.pragma('mmap_size = 30000000000'); // 30GB
  db.pragma('page_size = 4096');
  db.pragma('auto_vacuum = INCREMENTAL');

  if (process.env.NODE_ENV === 'development') {
    db.pragma('optimize');
  }

  return db;
}
