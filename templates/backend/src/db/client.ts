import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { config } from '../config';

// TODO: Crear conexión a SQLite
const sqlite = new Database(config.DATABASE_URL, {
  verbose: config.NODE_ENV === 'development' ? console.log : undefined
});

// TODO: Configurar PRAGMA para optimización y seguridad
sqlite.pragma('journal_mode = WAL'); // Write-Ahead Logging para mejor concurrencia
sqlite.pragma('foreign_keys = ON'); // Habilitar foreign keys
sqlite.pragma('busy_timeout = 5000'); // Timeout de 5 segundos en locks
sqlite.pragma('synchronous = NORMAL'); // Balance entre seguridad y velocidad

// TODO: Crear instancia de Drizzle con el schema
export const db = drizzle(sqlite, { schema });

// TODO: Función para cerrar la conexión (útil en tests)
export const closeDatabase = () => {
  sqlite.close();
};

// TODO: Exportar instancia SQLite para casos especiales (migraciones, raw queries)
export { sqlite };
