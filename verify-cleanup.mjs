import { readFileSync } from 'fs';

const content = readFileSync('src/data/products.ts', 'utf8');

console.log('\n=== VERIFICACIÓN DE LIMPIEZA ===\n');

// Buscar productos sys-*
const sysProductsRegex = /id:\s*['"`]sys-[^'"`]+['"`]/g;
const sysProducts = content.match(sysProductsRegex);

if (sysProducts) {
  console.log('❌ PRODUCTOS sys-* ENCONTRADOS:', sysProducts.length);
  sysProducts.forEach((p) => console.log('   -', p));
} else {
  console.log('✅ NO hay productos sys-* en el archivo');
}

// Estadísticas generales
const lines = content.split('\n').length;
console.log('\n📊 ESTADÍSTICAS:');
console.log('   - Total de líneas:', lines);

// Contar productos aproximadamente
const productMatches = content.match(/\{\s*\n\s*id:/g);
const productCount = productMatches ? productMatches.length : 0;
console.log('   - Total de productos (aproximado):', productCount);

// Verificar referencias en systems
console.log('\n🔍 REFERENCIAS EN SISTEMAS:');
const inmunologico = content.match(
  /id:\s*['"`]sistema-inmunologico['"`][^}]+products:\s*\[([^\]]+)\]/s
);
if (inmunologico) {
  const prods = inmunologico[1].match(/['"`]sys-[^'"`]+['"`]/g);
  if (prods) {
    console.log('   ❌ Sistema inmunológico contiene sys-*:', prods.length);
  } else {
    console.log('   ✅ Sistema inmunológico limpio');
  }
}

const cardiovascular = content.match(
  /id:\s*['"`]sistema-cardiovascular['"`][^}]+products:\s*\[([^\]]+)\]/s
);
if (cardiovascular) {
  const prods = cardiovascular[1].match(/['"`]sys-[^'"`]+['"`]/g);
  if (prods) {
    console.log('   ❌ Sistema cardiovascular contiene sys-*:', prods.length);
  } else {
    console.log('   ✅ Sistema cardiovascular limpio');
  }
}

const oseo = content.match(
  /id:\s*['"`]sistema-oseo-mineral['"`][^}]+products:\s*\[([^\]]+)\]/s
);
if (oseo) {
  const prods = oseo[1].match(/['"`]sys-[^'"`]+['"`]/g);
  if (prods) {
    console.log('   ❌ Sistema óseo-mineral contiene sys-*:', prods.length);
  } else {
    console.log('   ✅ Sistema óseo-mineral limpio');
  }
}

console.log('\n✅ VERIFICACIÓN COMPLETADA\n');
