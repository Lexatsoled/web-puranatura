import Database from 'better-sqlite3';

const db = new Database('./data/store.db');

console.log('\n📋 TABLAS EN LA BASE DE DATOS:\n');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
tables.forEach(t => console.log(`  - ${t.name}`));

console.log('\n');
db.close();
