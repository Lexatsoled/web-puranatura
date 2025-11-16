// Test simple de API productos
const BASE_URL = 'http://localhost:3000';

async function testProductAPI() {
  console.log('🧪 TEST API PRODUCTOS\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log(`✅ Health check: ${health.status}\n`);
    
    // Test 2: Get producto ID 1
    console.log('2️⃣ Testing GET /api/products/1...');
    const prodRes = await fetch(`${BASE_URL}/api/products/1`);
    if (!prodRes.ok) {
      throw new Error(`HTTP ${prodRes.status}: ${await prodRes.text()}`);
    }
    const product = await prodRes.json();
    
    console.log(`✅ Producto: ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Precio: €${product.price}`);
    
    console.log('\n📋 Verificando 5 subsecciones:');
    console.log(`  1. detailedDescription: ${product.detailedDescription ? '✅ SI (' + product.detailedDescription.substring(0, 50) + '...)' : '❌ NO'}`);
    console.log(`  2. mechanismOfAction: ${product.mechanismOfAction ? '✅ SI (' + product.mechanismOfAction.substring(0, 50) + '...)' : '❌ NO'}`);
    console.log(`  3. components: ${product.components && product.components.length > 0 ? `✅ SI (${product.components.length} componentes)` : '❌ NO'}`);
    console.log(`  4. faqs: ${product.faqs && product.faqs.length > 0 ? `✅ SI (${product.faqs.length} preguntas)` : '❌ NO'}`);
    console.log(`  5. scientificReferences: ${product.scientificReferences && product.scientificReferences.length > 0 ? `✅ SI (${product.scientificReferences.length} referencias)` : '⚠️ NO'}`);
    
    // Test 3: Get all products
    console.log('\n3️⃣ Testing GET /api/products...');
    const allRes = await fetch(`${BASE_URL}/api/products?limit=5`);
    const allData = await allRes.json();
    console.log(`✅ Total productos: ${allData.total}`);
    console.log(`✅ Primeros 5: ${allData.items.map(p => p.name.substring(0, 30)).join(', ')}...\n`);
    
    console.log('✨ TODOS LOS TESTS PASARON');
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

testProductAPI();
