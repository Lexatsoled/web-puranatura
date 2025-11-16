// Script para encontrar productos sin información completa
const fs = require('fs');

// Leer el archivo products.ts
const content = fs.readFileSync('./data/products.ts', 'utf8');

// Dividir el contenido en bloques de productos
const products = content.split(/\s*{\s*id:/);

// Información sobre productos incompletos
const incomplete = {
  noDetailedDescription: [],
  noComponents: [],
  noUsage: [],
  noFrecuentQuestions: [],
};

console.log(`🔍 Analizando ${products.length} productos...\n`);

products.forEach((product, index) => {
  if (index === 0) return; // Saltar el primer elemento (antes del primer producto)

  // Extraer ID del producto
  const idMatch = product.match(/^\s*["']([^"']+)["']/);
  if (!idMatch) return;

  const productId = idMatch[1];

  // Verificar si falta cada campo
  if (!product.includes('detailedDescription:')) {
    incomplete.noDetailedDescription.push(productId);
  }

  if (!product.includes('components:')) {
    incomplete.noComponents.push(productId);
  }

  if (!product.includes('usage:')) {
    incomplete.noUsage.push(productId);
  }

  if (!product.includes('frecuentQuestions:')) {
    incomplete.noFrecuentQuestions.push(productId);
  }
});

// Mostrar resultados
console.log(
  `❌ Productos sin detailedDescription (${incomplete.noDetailedDescription.length}):`
);
incomplete.noDetailedDescription.forEach((id) => console.log(`  - ${id}`));

console.log(
  `\n❌ Productos sin components (${incomplete.noComponents.length}):`
);
if (incomplete.noComponents.length <= 20) {
  incomplete.noComponents.forEach((id) => console.log(`  - ${id}`));
} else {
  incomplete.noComponents
    .slice(0, 20)
    .forEach((id) => console.log(`  - ${id}`));
  console.log(`  ... y ${incomplete.noComponents.length - 20} más`);
}

console.log(`\n❌ Productos sin usage (${incomplete.noUsage.length}):`);
if (incomplete.noUsage.length <= 20) {
  incomplete.noUsage.forEach((id) => console.log(`  - ${id}`));
} else {
  incomplete.noUsage.slice(0, 20).forEach((id) => console.log(`  - ${id}`));
  console.log(`  ... y ${incomplete.noUsage.length - 20} más`);
}

console.log(
  `\n❌ Productos sin frecuentQuestions (${incomplete.noFrecuentQuestions.length}):`
);
if (incomplete.noFrecuentQuestions.length <= 20) {
  incomplete.noFrecuentQuestions.forEach((id) => console.log(`  - ${id}`));
} else {
  incomplete.noFrecuentQuestions
    .slice(0, 20)
    .forEach((id) => console.log(`  - ${id}`));
  console.log(`  ... y ${incomplete.noFrecuentQuestions.length - 20} más`);
}

// Productos completamente sin información (tienen todos los campos faltantes)
const completelyMissing = incomplete.noDetailedDescription.filter(
  (id) =>
    incomplete.noComponents.includes(id) &&
    incomplete.noUsage.includes(id) &&
    incomplete.noFrecuentQuestions.includes(id)
);

console.log(
  `\n🚨 PRODUCTOS COMPLETAMENTE SIN INFORMACIÓN (${completelyMissing.length}):`
);
completelyMissing.forEach((id) => console.log(`  - ${id}`));

console.log(`\n📊 RESUMEN:`);
console.log(`Total productos analizados: ${products.length - 1}`);
console.log(
  `Sin detailedDescription: ${incomplete.noDetailedDescription.length}`
);
console.log(`Sin components: ${incomplete.noComponents.length}`);
console.log(`Sin usage: ${incomplete.noUsage.length}`);
console.log(`Sin frecuentQuestions: ${incomplete.noFrecuentQuestions.length}`);
console.log(`Completamente sin información: ${completelyMissing.length}`);
