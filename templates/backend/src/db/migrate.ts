import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db, sqlite } from './client';

// TODO: Ejecutar migraciones desde la carpeta migrations/
async function runMigrations() {
  console.log('⏳ Ejecutando migraciones...');
  
  try {
    migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('✅ Migraciones completadas exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// TODO: Ejecutar si se llama directamente
runMigrations();
