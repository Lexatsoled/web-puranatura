// Script para debuggear el problema de categorías
import { products, productCategories } from './data/products.js';

console.log('=== DEBUG DE CATEGORÍAS ===');

// 1. Verificar total de productos
console.log(`Total productos: ${products.length}`);

// 2. Verificar categorías disponibles
console.log('\nCategorías disponibles:');
productCategories.forEach((cat) => {
  console.log(`- ID: "${cat.id}" | Nombre: "${cat.name}"`);
});

// 3. Verificar productos con vitaminas-minerales
const vitaminasProducts = products.filter(
  (p) => p.categories && p.categories.includes('vitaminas-minerales')
);

console.log(
  `\nProductos con categoría "vitaminas-minerales": ${vitaminasProducts.length}`
);
if (vitaminasProducts.length > 0) {
  console.log('Primeros 3 productos:');
  vitaminasProducts.slice(0, 3).forEach((p) => {
    console.log(`- ${p.name} | Categorías: [${p.categories?.join(', ')}]`);
  });
}

// 4. Verificar si algún producto tiene problemas
const productosProblematicos = products.filter(
  (p) => !p.categories || p.categories.length === 0
);
console.log(`\nProductos sin categorías: ${productosProblematicos.length}`);

console.log('\n=== FIN DEBUG ===');
