import Database from 'better-sqlite3';

const db = new Database('./data/store.db');

// Insertar productos de prueba con imágenes
const products = [
  {
    name: 'Alfa',
    description: 'Producto de prueba Alfa con imágenes',
    price: 19.99,
    stock: 10,
    category: 'vitaminas',
    images: JSON.stringify(['/Jpeg/5-HTP, 200 mg Anverso.jpg', '/Jpeg/5-HTP, 200 mg Reverso.jpg']),
    is_featured: true
  },
  {
    name: 'Beta',
    description: 'Producto de prueba Beta con imágenes',
    price: 24.99,
    stock: 15,
    category: 'minerales',
    images: JSON.stringify(['/Jpeg/3-day-liver-cleanse-anverso.jpg', '/Jpeg/3-day-liver-cleanse-reverso.jpg']),
    is_featured: true
  },
  {
    name: 'Gamma',
    description: 'Producto de prueba Gamma con imágenes',
    price: 29.99,
    stock: 20,
    category: 'suplementos',
    images: JSON.stringify(['/Jpeg/5-HTP, 200 mg Anverso.jpg', '/Jpeg/5-HTP, 200 mg Reverso.jpg']),
    is_featured: true
  }
];

const stmt = db.prepare(`
  INSERT INTO products (name, description, price, stock, category, images)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const p of products) {
  try {
    const result = stmt.run(p.name, p.description, p.price, p.stock, p.category, p.images);
    console.log(`✅ Creado ${p.name} (id=${result.lastInsertRowid})`);
  } catch (error) {
    console.log(`⚠️  ${p.name} ya existe o error: ${error.message}`);
  }
}

// Verificar
console.log('\n📋 Productos en la base de datos:');
const allProducts = db.prepare('SELECT id, name, images FROM products').all();
for (const p of allProducts) {
  const imageCount = p.images ? JSON.parse(p.images).length : 0;
  console.log(`${p.id}. ${p.name}: ${imageCount} imágenes`);
}

db.close();
