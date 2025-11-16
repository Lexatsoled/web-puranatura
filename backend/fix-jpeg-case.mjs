import Database from 'better-sqlite3';

console.log('🔧 Corrigiendo mayúscula de /Jpeg/...\n');

const db = new Database('./database.sqlite');

const products = db.prepare('SELECT id, name, images FROM products').all();

let fixed = 0;

for (const product of products) {
  if (!product.images || product.images === '[]') continue;
  
  try {
    const images = JSON.parse(product.images);
    let changed = false;
    
    const fixedImages = images.map(img => {
      if (typeof img === 'string' && img.startsWith('/jpeg/')) {
        changed = true;
        return img.replace('/jpeg/', '/Jpeg/');
      }
      return img;
    });
    
    if (changed) {
      db.prepare('UPDATE products SET images = ? WHERE id = ?')
        .run(JSON.stringify(fixedImages), product.id);
      
      fixed++;
      console.log(`✅ ID ${product.id}: ${product.name}`);
      console.log(`   ${images[0]} → ${fixedImages[0]}`);
    }
  } catch (e) {
    console.error(`❌ Error en producto ${product.id}:`, e.message);
  }
}

console.log(`\n✅ Corregidos ${fixed} productos`);
db.close();
