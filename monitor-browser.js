// Script para monitorear peticiones en la consola del navegador
// Copia y pega esto en la consola de DevTools (F12)

console.clear();
console.log('🔍 Monitoreando peticiones a /api/products...\n');

const originalFetch = window.fetch;
const requests = [];

window.fetch = function(...args) {
  const url = args[0];
  if (typeof url === 'string' && url.includes('/api/products')) {
    const timestamp = new Date().toISOString();
    requests.push({ url, timestamp });
    console.log(`%c[${requests.length}] ${timestamp}`, 'color: #4CAF50; font-weight: bold');
    console.log(`   ${url}`);
    
    // Detectar duplicados inmediatos
    const recent = requests.filter(r => Date.now() - new Date(r.timestamp).getTime() < 1000);
    const duplicates = recent.filter(r => r.url === url);
    if (duplicates.length > 1) {
      console.warn(`⚠️  Petición duplicada detectada (${duplicates.length}x en <1s)`);
    }
  }
  return originalFetch.apply(this, args);
};

// Resumen después de 5 segundos
setTimeout(() => {
  console.log('\n📊 RESUMEN DE PETICIONES:');
  console.log(`   Total: ${requests.length}`);
  
  const urlCounts = requests.reduce((acc, req) => {
    acc[req.url] = (acc[req.url] || 0) + 1;
    return acc;
  }, {});
  
  const uniqueUrls = Object.keys(urlCounts).length;
  console.log(`   URLs únicas: ${uniqueUrls}`);
  
  Object.entries(urlCounts).forEach(([url, count]) => {
    const icon = count > 1 ? '❌' : '✅';
    console.log(`   ${icon} ${count}x: ${url}`);
  });
  
  const totalDuplicates = requests.length - uniqueUrls;
  if (totalDuplicates === 0) {
    console.log('\n✅ ¡No hay peticiones duplicadas!');
  } else {
    console.error(`\n❌ ${totalDuplicates} peticiones duplicadas detectadas`);
  }
}, 5000);

console.log('✅ Monitor activado. Recarga la página para ver las peticiones.\n');
