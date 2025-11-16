import Database from 'better-sqlite3';

const db = new Database('./backend/database.sqlite');
const products = db.prepare('SELECT id, name, price, stock FROM products LIMIT 10').all();

console.log('\n✅ PRIMEROS 10 PRODUCTOS EN LA BASE DE DATOS:\n');
products.forEach(p => {
  console.log(`  ID ${p.id}: ${p.name} - ${p.price} RDS (Stock: ${p.stock})`);
});

console.log(`\n✅ Total productos: ${db.prepare('SELECT COUNT(*) as count FROM products').get().count}\n`);

db.close();
