import Database from 'better-sqlite3';

const db = new Database('./data/store.db');

console.log('🔧 Ajustando IDs de productos para coincidir con el frontend...\n');

// Eliminar productos actuales
db.prepare('DELETE FROM products').run();
console.log('✅ Productos anteriores eliminados');

// Insertar productos con IDs específicos que espera el frontend
const products = [
  {
    id: 326,
    name: 'Beta',
    description: 'Producto Beta con limpieza hepática de 3 días',
    price: 24.99,
    stock: 15,
    category: 'suplementos-especializados',
    images: JSON.stringify([
      '/Jpeg/3-day-liver-cleanse-anverso.jpg',
      '/Jpeg/3-day-liver-cleanse-reverso.jpg'
    ])
  },
  {
    id: 327,
    name: 'Alfa',
    description: 'Producto Alfa con 5-HTP 200mg para bienestar mental',
    price: 19.99,
    stock: 10,
    category: 'sistema-nervioso',
    images: JSON.stringify([
      '/Jpeg/5-HTP, 200 mg Anverso.jpg',
      '/Jpeg/5-HTP, 200 mg Reverso.jpg'
    ])
  },
  {
    id: 328,
    name: 'Gamma',
    description: 'Producto Gamma con 5-HTP para estado de ánimo',
    price: 29.99,
    stock: 20,
    category: 'sistema-nervioso',
    images: JSON.stringify([
      '/Jpeg/5-HTP, 200 mg Anverso.jpg',
      '/Jpeg/5-HTP, 200 mg Reverso.jpg'
    ])
  }
];

const stmt = db.prepare(`
  INSERT INTO products (id, name, description, price, stock, category, images)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const p of products) {
  stmt.run(p.id, p.name, p.description, p.price, p.stock, p.category, p.images);
  console.log(`✅ Creado producto "${p.name}" con ID=${p.id}`);
}

// Verificar
console.log('\n📋 Productos finales en la base de datos:');
const allProducts = db.prepare('SELECT id, name, images FROM products ORDER BY id').all();
for (const p of allProducts) {
  const images = JSON.parse(p.images);
  console.log(`  ${p.id}. ${p.name}: ${images.length} imágenes`);
  images.forEach((img, i) => console.log(`     ${i + 1}. ${img}`));
}

console.log('\n✅ Base de datos lista. Productos accesibles en:');
console.log('   - http://localhost:3000/tienda/producto/326 (Beta)');
console.log('   - http://localhost:3000/tienda/producto/327 (Alfa)');
console.log('   - http://localhost:3000/tienda/producto/328 (Gamma)');

db.close();
