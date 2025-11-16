// Script para identificar productos con información faltante
// Analiza todos los productos y marca cuáles necesitan información detallada

const fs = require('fs');

// Leer el archivo de productos
const productsFile = fs.readFileSync('./data/products.ts', 'utf8');

// Extraer todos los productos usando regex
const productMatches = productsFile.match(
  /{\s*id:\s*["']([^"']+)["'][^}]*?}/gs
);

if (productMatches) {
  console.log('🔍 ANÁLISIS DE PRODUCTOS CON INFORMACIÓN FALTANTE');
  console.log('='.repeat(60));

  let productsWithoutDetail = [];
  let productsWithoutComponents = [];
  let productsWithoutUsage = [];
  let productsWithoutQuestions = [];

  productMatches.forEach((match) => {
    // Extraer ID del producto
    const idMatch = match.match(/id:\s*["']([^"']+)["']/);
    const nameMatch = match.match(/name:\s*['"]([^'"]+)['"]/);

    if (idMatch && nameMatch) {
      const id = idMatch[1];
      const name = nameMatch[1];

      // Buscar el producto completo (incluyendo contenido después de la llave)
      const productStart = productsFile.indexOf(`id: "${id}"`);
      const nextProductStart = productsFile.indexOf('id:', productStart + 1);
      const productEnd =
        nextProductStart > 0 ? nextProductStart : productsFile.length;
      const fullProduct = productsFile.substring(productStart, productEnd);

      // Verificar qué información falta
      const hasDetailedDescription = fullProduct.includes(
        'detailedDescription:'
      );
      const hasComponents = fullProduct.includes('components:');
      const hasUsage = fullProduct.includes('usage:');
      const hasQuestions = fullProduct.includes('frecuentQuestions:');

      if (!hasDetailedDescription) {
        productsWithoutDetail.push({ id, name });
      }
      if (!hasComponents) {
        productsWithoutComponents.push({ id, name });
      }
      if (!hasUsage) {
        productsWithoutUsage.push({ id, name });
      }
      if (!hasQuestions) {
        productsWithoutQuestions.push({ id, name });
      }
    }
  });

  console.log(
    `\n❌ PRODUCTOS SIN DETAILED DESCRIPTION (${productsWithoutDetail.length}):`
  );
  productsWithoutDetail.forEach((p) => console.log(`  - ${p.id}: ${p.name}`));

  console.log(
    `\n❌ PRODUCTOS SIN COMPONENTS (${productsWithoutComponents.length}):`
  );
  productsWithoutComponents.forEach((p) =>
    console.log(`  - ${p.id}: ${p.name}`)
  );

  console.log(`\n❌ PRODUCTOS SIN USAGE (${productsWithoutUsage.length}):`);
  productsWithoutUsage.forEach((p) => console.log(`  - ${p.id}: ${p.name}`));

  console.log(
    `\n❌ PRODUCTOS SIN FREQUENT QUESTIONS (${productsWithoutQuestions.length}):`
  );
  productsWithoutQuestions.forEach((p) =>
    console.log(`  - ${p.id}: ${p.name}`)
  );

  // Productos que tienen TODA la información faltante
  const completelyIncomplete = productsWithoutDetail.filter(
    (p) =>
      productsWithoutComponents.some((pc) => pc.id === p.id) &&
      productsWithoutUsage.some((pu) => pu.id === p.id) &&
      productsWithoutQuestions.some((pq) => pq.id === p.id)
  );

  console.log(
    `\n🚨 PRODUCTOS CRÍTICOS - SIN NINGUNA INFO DETALLADA (${completelyIncomplete.length}):`
  );
  completelyIncomplete.forEach((p) => console.log(`  - ${p.id}: ${p.name}`));
} else {
  console.log('❌ No se pudieron encontrar productos en el archivo');
}
