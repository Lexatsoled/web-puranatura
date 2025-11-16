import Database from 'better-sqlite3';
import { readFileSync } from 'fs';

console.log('🔍 Verificando productos faltantes...\n');

const db = new Database('./database.sqlite');

// Leer products-data.ts y contar exports
const fileContent = readFileSync('./src/db/products-data.ts', 'utf-8');

// Contar cuántas veces aparece "export const" (cada producto es un export)
// Contar los "name:" en el archivo
const nameMatches = fileContent.match(/name:\s*['"`]/g);
const fileProductCount = nameMatches ? nameMatches.length : 0;

// Obtener productos de la BD
const dbProducts = db.prepare('SELECT id, name, sku FROM products ORDER BY id').all();

console.log(`📦 Productos definidos en products-data.ts: ~${fileProductCount}`);
console.log(`💾 Productos en database.sqlite: ${dbProducts.length}`);
console.log(`❓ Diferencia aproximada: ${fileProductCount - dbProducts.length}\n`);

console.log('📋 Productos actualmente en la base de datos:\n');
dbProducts.forEach((p, i) => {
  if (i < 5 || i >= dbProducts.length - 5) {
    console.log(`   ${p.id}. ${p.name} (${p.sku})`);
  } else if (i === 5) {
    console.log(`   ... (${dbProducts.length - 10} productos más) ...`);
  }
});

console.log('\n✅ Análisis completado');
console.log('\nℹ️  Para cargar todos los productos del archivo, ejecuta:');
console.log('   npm run db:seed');

db.close();
