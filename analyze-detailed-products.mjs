import fs from 'fs';

const content = fs.readFileSync('src/data/products.ts', 'utf8');

// Buscar todos los productos
const productPattern = /{\s*id:\s*["']([^"']+)["']/g;
const products = [];
let match;

while ((match = productPattern.exec(content)) !== null) {
  const productId = match[1];
  const startPos = match.index;
  
  // Buscar el siguiente producto o el final del array
  const nextProductMatch = content.slice(startPos + 50).search(/{\s*id:\s*["']/);
  const endPos = nextProductMatch === -1 ? content.length : startPos + 50 + nextProductMatch;
  
  const productBlock = content.slice(startPos, endPos);
  
  // Verificar qué campos tiene este producto
  const hasDetailed = productBlock.includes('detailedDescription:');
  const hasMechanism = productBlock.includes('mechanismOfAction:');
  const hasBenefits = productBlock.includes('benefitsDescription:');
  const hasComponents = productBlock.includes('components:');
  const hasDosage = productBlock.includes('dosage:');
  const hasFaqs = productBlock.includes('faqs:');
  const hasReferences = productBlock.includes('scientificReferences:');
  
  products.push({
    id: productId,
    hasDetailed,
    hasMechanism,
    hasBenefits,
    hasComponents,
    hasDosage,
    hasFaqs,
    hasReferences,
    isComplete: hasDetailed && hasComponents && hasDosage && hasFaqs
  });
}

console.log('\n=== ANÁLISIS DE PRODUCTOS ===\n');
console.log(`Total de productos: ${products.length}\n`);

const completeProducts = products.filter(p => p.isComplete);
const withReferences = products.filter(p => p.hasReferences);
const incompleteButWithSomeInfo = products.filter(p => !p.isComplete && (p.hasDetailed || p.hasComponents || p.hasDosage || p.hasFaqs));

console.log(`✅ Productos COMPLETOS (detailedDescription + components + dosage + faqs): ${completeProducts.length}`);
completeProducts.forEach(p => console.log(`   - ${p.id}`));

console.log(`\n📚 Productos con Referencias Científicas: ${withReferences.length}`);
withReferences.forEach(p => console.log(`   - ${p.id}`));

console.log(`\n⚠️  Productos INCOMPLETOS pero con alguna información: ${incompleteButWithSomeInfo.length}`);
incompleteButWithSomeInfo.forEach(p => {
  const fields = [];
  if (p.hasDetailed) fields.push('detailed');
  if (p.hasMechanism) fields.push('mechanism');
  if (p.hasBenefits) fields.push('benefits');
  if (p.hasComponents) fields.push('components');
  if (p.hasDosage) fields.push('dosage');
  if (p.hasFaqs) fields.push('faqs');
  if (p.hasReferences) fields.push('references');
  console.log(`   - ${p.id} [${fields.join(', ')}]`);
});

const emptyProducts = products.filter(p => !p.hasDetailed && !p.hasComponents && !p.hasDosage && !p.hasFaqs && !p.hasReferences);
console.log(`\n❌ Productos sin información extendida: ${emptyProducts.length}`);

console.log('\n=== RESUMEN ===');
console.log(`Completos: ${completeProducts.length}/${products.length}`);
console.log(`Con referencias: ${withReferences.length}/${products.length}`);
console.log(`Incompletos: ${incompleteButWithSomeInfo.length}/${products.length}`);
console.log(`Vacíos: ${emptyProducts.length}/${products.length}`);
