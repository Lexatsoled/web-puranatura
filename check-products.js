// Importar los productos
const fs = require('fs');

// Leer el archivo de productos como texto
const productsContent = fs.readFileSync('./data/products.ts', 'utf8');

// Buscar productos que empiecen con pr- pero no tengan la información completa
const productLines = productsContent.split('\n');
let currentProductId = null;
let incompleteProducts = [];
let hasUsage = false;
let hasFaqs = false;
let hasComponents = false;
let hasDetailedDescription = false;

for (let i = 0; i < productLines.length; i++) {
  const line = productLines[i].trim();
  
  // Detectar inicio de nuevo producto
  if (line.includes('id: "pr-') && line.includes('"')) {
    // Si había un producto anterior, verificar si estaba completo
    if (currentProductId && (!hasUsage || !hasFaqs || !hasComponents || !hasDetailedDescription)) {
      incompleteProducts.push({
        id: currentProductId,
        usage: hasUsage,
        faqs: hasFaqs,
        components: hasComponents,
        detailedDescription: hasDetailedDescription
      });
    }
    
    // Reiniciar para nuevo producto
    currentProductId = line.match(/id: "(pr-[^"]+)"/)[1];
    hasUsage = false;
    hasFaqs = false;
    hasComponents = false;
    hasDetailedDescription = false;
  }
  
  // Verificar campos requeridos
  if (line.includes('usage:')) hasUsage = true;
  if (line.includes('faqs:')) hasFaqs = true;
  if (line.includes('components:')) hasComponents = true;
  if (line.includes('detailedDescription:')) hasDetailedDescription = true;
}

// Verificar último producto
if (currentProductId && (!hasUsage || !hasFaqs || !hasComponents || !hasDetailedDescription)) {
  incompleteProducts.push({
    id: currentProductId,
    usage: hasUsage,
    faqs: hasFaqs,
    components: hasComponents,
    detailedDescription: hasDetailedDescription
  });
}

console.log('Productos con información incompleta:');
console.log('=====================================');
incompleteProducts.forEach(product => {
  console.log(`\nProducto: ${product.id}`);
  console.log(`  - Usage: ${product.usage ? '✅' : '❌'}`);
  console.log(`  - FAQs: ${product.faqs ? '✅' : '❌'}`);
  console.log(`  - Components: ${product.components ? '✅' : '❌'}`);
  console.log(`  - DetailedDescription: ${product.detailedDescription ? '✅' : '❌'}`);
});

console.log(`\n📊 Total productos incompletos: ${incompleteProducts.length}`);