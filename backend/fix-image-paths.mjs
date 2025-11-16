import Database from 'better-sqlite3';

console.log('🔧 Corrigiendo rutas de imágenes con espacios...\n');

const db = new Database('./database.sqlite');

// Obtener todos los productos
const products = db.prepare('SELECT id, name, images FROM products').all();

let fixed = 0;

for (const product of products) {
  if (!product.images || product.images === '[]') continue;
  
  try {
    const images = JSON.parse(product.images);
    let changed = false;
    
    const fixedImages = images.map(img => {
      if (typeof img === 'string' && img.includes(' ')) {
        changed = true;
        // Mantener /Jpeg/ con mayúscula, solo convertir el nombre del archivo
        const parts = img.split('/');
        const fileName = parts[parts.length - 1];
        const newFileName = fileName.replace(/ /g, '-').toLowerCase();
        parts[parts.length - 1] = newFileName;
        return parts.join('/');
      }
      return img;
    });
    
    if (changed) {
      db.prepare('UPDATE products SET images = ? WHERE id = ?')
        .run(JSON.stringify(fixedImages), product.id);
      
      fixed++;
      console.log(`✅ ID ${product.id}: ${product.name}`);
      console.log(`   Antes: ${images[0]}`);
      console.log(`   Ahora: ${fixedImages[0]}\n`);
    }
  } catch (e) {
    console.error(`❌ Error en producto ${product.id}:`, e.message);
  }
}

console.log(`\n✅ Corregidos ${fixed} productos`);
db.close();
