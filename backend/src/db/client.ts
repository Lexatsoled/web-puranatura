import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { config } from '../config/index.js';
import { createOptimizedDatabase } from './connection.js';

const sqlite = createOptimizedDatabase(config.DATABASE_PATH, {
  verbose: config.NODE_ENV === 'development' ? console.log : undefined,
});

export const db = drizzle(sqlite, { schema });

export const closeDatabase = () => {
  sqlite.close();
};

export { sqlite };
