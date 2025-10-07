import { systems } from '../data/products';

console.log('=== VERIFICACIÓN DE SISTEMAS SINÉRGICOS ===');
console.log(`Total de sistemas encontrados: ${systems.length}`);
console.log('');

systems.forEach((system, index) => {
  console.log(`${index + 1}. ${system.name}`);
  console.log(`   ID: ${system.id}`);
  console.log(`   Destacado: ${system.featured ? 'SÍ' : 'NO'}`);
  console.log(`   Productos: ${system.products.length}`);
  console.log(`   Beneficios: ${system.benefits.length}`);
  console.log(`   Color: ${system.color}`);
  console.log('');
});

console.log('=== SISTEMAS DESTACADOS ===');
const featured = systems.filter(s => s.featured);
featured.forEach(system => {
  console.log(`✨ ${system.name} - ${system.description}`);
});

console.log('=== SISTEMAS NO DESTACADOS ===');
const notFeatured = systems.filter(s => !s.featured);
notFeatured.forEach(system => {
  console.log(`🔧 ${system.name} - ${system.description}`);
});