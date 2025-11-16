// Buscar productos que NO tengan FAQs
const fs = require('fs');

// Leer el archivo de productos como texto
const productsContent = fs.readFileSync('./data/products.ts', 'utf8');

// Buscar productos pr- que no tengan faqs:
const productSections = productsContent.split(/id: "pr-/);
const incompleteProducts = [];

for (let i = 1; i < productSections.length; i++) {
  const section = productSections[i];
  const idMatch = section.match(/^([^"]+)/);

  if (idMatch) {
    const productId = 'pr-' + idMatch[1];

    // Buscar el final del producto (siguiente producto o final del array)
    const endOfProduct =
      section.indexOf('  },') !== -1
        ? section.substring(0, section.indexOf('  },') + 4)
        : section;

    // Verificar si tiene faqs
    const hasFaqs = endOfProduct.includes('faqs:');
    const hasUsage =
      endOfProduct.includes('usage:') ||
      endOfProduct.includes('administrationMethod:');
    const hasComponents = endOfProduct.includes('components:');
    const hasDetailedDescription = endOfProduct.includes(
      'detailedDescription:'
    );

    if (!hasFaqs || !hasUsage || !hasComponents || !hasDetailedDescription) {
      incompleteProducts.push({
        id: productId,
        faqs: hasFaqs,
        usage: hasUsage,
        components: hasComponents,
        detailedDescription: hasDetailedDescription,
      });
    }
  }
}

console.log('🔍 PRODUCTOS CON INFORMACIÓN INCOMPLETA:');
console.log('==========================================');

incompleteProducts.forEach((product) => {
  console.log(`\n📦 ${product.id}`);
  console.log(
    `   ✅ Descripción detallada: ${product.detailedDescription ? 'SÍ' : '❌ NO'}`
  );
  console.log(`   ✅ Componentes: ${product.components ? 'SÍ' : '❌ NO'}`);
  console.log(`   ✅ Modo de empleo: ${product.usage ? 'SÍ' : '❌ NO'}`);
  console.log(`   ✅ FAQs: ${product.faqs ? 'SÍ' : '❌ NO'}`);
});

console.log(
  `\n📊 RESUMEN: ${incompleteProducts.length} productos necesitan completarse`
);

if (incompleteProducts.length === 0) {
  console.log('\n🎉 ¡TODOS LOS PRODUCTOS ESTÁN COMPLETOS!');
}
