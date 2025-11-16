import fs from 'fs';

const content = fs.readFileSync('src/data/products.ts', 'utf8');

// Buscar todos los productos vacíos
// const productPattern = /{\s*id:\s*["']([^"']+)["'][^}]*?name:\s*['"]([^'"]+)['"]/gs; // Not used
const products = [];
let match;

// Reset regex
const fullPattern =
  /{\s*id:\s*["']([^"']+)["'],?\s*name:\s*['"]([^'"]+)['"],?\s*(?:categories|category):[^,]*,?\s*price:[^,]*,?\s*description:[^,]*,[^}]*?}/gs;

while ((match = fullPattern.exec(content)) !== null) {
  const productId = match[1];
  const productName = match[2];
  const startPos = match.index;

  // Buscar el bloque completo del producto
  const nextProductMatch = content
    .slice(startPos + 50)
    .search(/{\s*id:\s*["']/);
  const endPos =
    nextProductMatch === -1 ? content.length : startPos + 50 + nextProductMatch;

  const productBlock = content.slice(startPos, endPos);

  // Verificar si tiene información detallada
  const hasDetailed = productBlock.includes('detailedDescription:');
  const hasComponents = productBlock.includes('components:');
  const hasDosage = productBlock.includes('dosage:');
  const hasFaqs = productBlock.includes('faqs:');

  if (!hasDetailed && !hasComponents && !hasDosage && !hasFaqs) {
    products.push({
      id: productId,
      name: productName,
    });
  }
}

console.log('\n=== PRODUCTOS SIN INFORMACIÓN DETALLADA ===\n');
console.log(`Total: ${products.length} productos\n`);

// Categorizar por tipo de producto
const prProducts = products.filter((p) => p.id.startsWith('pr-'));
const numericProducts = products.filter((p) => /^\d+$/.test(p.id));
const sysProducts = products.filter((p) => p.id.startsWith('sys-'));

console.log(`🔹 Productos Piping Rock (pr-*): ${prProducts.length}`);
prProducts.forEach((p) => console.log(`   - ${p.id}: ${p.name}`));

console.log(`\n🔹 Productos Numéricos: ${numericProducts.length}`);
numericProducts.forEach((p) => console.log(`   - ${p.id}: ${p.name}`));

console.log(`\n🔹 Sistemas (sys-*): ${sysProducts.length}`);
sysProducts.forEach((p) => console.log(`   - ${p.id}: ${p.name}`));

console.log('\n=== PRODUCTOS PRIORITARIOS PARA AGREGAR INFORMACIÓN ===');
console.log('(Productos Piping Rock con mayor relevancia):\n');

const priority = [
  'pr-fish-oil',
  'pr-same',
  'pr-maca',
  'pr-ashwagandha',
  'pr-bamboo-extract',
  'pr-borage-oil',
  'pr-liver-cleanse',
  'pr-gaba',
  'pr-coq10',
  'pr-bacopa',
  'pr-pqq',
];

priority.forEach((id) => {
  const product = products.find((p) => p.id === id);
  if (product) {
    console.log(`   ❗ ${product.id}: ${product.name}`);
  }
});
