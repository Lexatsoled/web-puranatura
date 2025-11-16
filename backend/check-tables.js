import Database from 'better-sqlite3';

const db = new Database('./data/store.db');

console.log('📋 Tablas en la base de datos:');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(tables.map(t => t.name).join(', '));

if (!tables.some(t => t.name === 'products')) {
  console.log('\n❌ La tabla products no existe. Ejecutando SQL de migración...');
  
  // Leer y ejecutar el SQL de migración
  const fs = await import('fs');
  const migrationSQL = fs.readFileSync('./src/db/migrations/0000_romantic_eternals.sql', 'utf-8');
  db.exec(migrationSQL);
  
  console.log('✅ Migración ejecutada');
}

db.close();
