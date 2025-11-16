import Database from 'better-sqlite3';

const db = new Database('./data/store.db');

console.log('🔍 Verificando producto 327 en la base de datos:\n');

const product = db.prepare('SELECT id, name, images FROM products WHERE id = ?').get(327);

console.log('Producto:', product);
console.log('\nTipo de images:', typeof product.images);
console.log('Contenido de images:', product.images);

if (typeof product.images === 'string') {
  try {
    const parsed = JSON.parse(product.images);
    console.log('\n✅ JSON parseado correctamente:', parsed);
    console.log('Es array:', Array.isArray(parsed));
    console.log('Cantidad de imágenes:', parsed.length);
  } catch (e) {
    console.log('\n❌ Error al parsear JSON:', e.message);
  }
}

db.close();
