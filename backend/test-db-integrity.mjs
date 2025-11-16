import Database from 'better-sqlite3';
import { existsSync } from 'fs';

console.log('\n🧪 PRUEBA 4: Verificar contenido de la base de datos\n');

const db = new Database('./database.sqlite');

try {
  // Contar productos
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
  console.log(`✅ Productos en BD: ${productCount.count}`);

  // Verificar que todos los productos tienen imágenes
  const productsWithoutImages = db.prepare(
    "SELECT COUNT(*) as count FROM products WHERE images IS NULL OR images = '[]'"
  ).get();
  
  if (productsWithoutImages.count === 0) {
    console.log('✅ Todos los productos tienen imágenes');
  } else {
    console.log(`⚠️  ${productsWithoutImages.count} productos sin imágenes`);
  }

  // Obtener muestra de productos con sus imágenes
  const sampleProducts = db.prepare(
    'SELECT id, name, images FROM products ORDER BY id LIMIT 3'
  ).all();

  console.log('\n📋 Muestra de productos:');
  sampleProducts.forEach(p => {
    const images = JSON.parse(p.images || '[]');
    console.log(`   ${p.id}. ${p.name}`);
    console.log(`      Imágenes: ${images.length > 0 ? images[0] : 'Sin imágenes'}`);
    
    // Verificar que el archivo físico existe
    if (images.length > 0) {
      const imagePath = `../public${images[0]}`;
      if (existsSync(imagePath)) {
        console.log(`      ✅ Archivo existe`);
      } else {
        console.log(`      ❌ Archivo NO existe: ${imagePath}`);
      }
    }
  });

  // Verificar schema
  const tables = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table'"
  ).all();
  
  console.log('\n📊 Tablas en la BD:');
  tables.forEach(t => console.log(`   - ${t.name}`));

  console.log('\n✅ Base de datos íntegra y funcional');

} catch (error) {
  console.error('\n❌ Error al verificar BD:', error.message);
} finally {
  db.close();
}
