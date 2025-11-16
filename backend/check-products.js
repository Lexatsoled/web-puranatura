const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

const products = db.prepare('SELECT id, name, price, stock FROM products ORDER BY id').all();

console.log('📦 Productos en la base de datos:\n');
products.forEach(p => {
  console.log(`  ${p.id}. ${p.name} - ${p.price}€ (Stock: ${p.stock})`);
});

console.log(`\n✅ Total: ${products.length} productos`);

db.close();
