import puppeteer from 'puppeteer';

const url = 'http://localhost:5173/tienda';

console.log('🔍 Monitoreando peticiones al backend...\n');

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

const requests = [];

page.on('request', (request) => {
  if (request.url().includes('/api/products')) {
    const timestamp = new Date().toISOString();
    requests.push({ url: request.url(), timestamp });
    console.log(`[${timestamp}] ${request.method()} ${request.url()}`);
  }
});

await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

console.log(`\n📊 Total de peticiones a /api/products: ${requests.length}`);

// Detectar duplicados
const urlCounts = requests.reduce((acc, req) => {
  acc[req.url] = (acc[req.url] || 0) + 1;
  return acc;
}, {});

console.log('\n🔄 Peticiones duplicadas:');
Object.entries(urlCounts).forEach(([url, count]) => {
  if (count > 1) {
    console.log(`  ❌ ${count}x: ${url}`);
  }
});

const uniqueRequests = Object.keys(urlCounts).length;
console.log(`\n✅ Peticiones únicas: ${uniqueRequests}`);
console.log(`❌ Peticiones duplicadas: ${requests.length - uniqueRequests}`);

await browser.close();
