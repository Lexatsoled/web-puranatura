const fs = require('fs');
const path = require('path');

const reportsFile = path.join(process.cwd(), 'backend', 'reports', 'csp-reports.ndjson');

async function run() {
  if (!fs.existsSync(reportsFile)) {
    console.log('No hay reports CSP.');
    process.exit(0);
  }

  const data = fs.readFileSync(reportsFile, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const total = data.length;
  let blocked = 0;

  for (const rec of data) {
    const payload = rec.payload?.['csp-report'] ?? rec.payload ?? {};
    const b = payload['blocked-uri'] ?? payload['blockedUri'] ?? payload['blocked_url'] ?? payload['blockedURL'];
    if (b) blocked++;
  }

  console.log('CSP Reports metrics');
  console.log('Total reports:', total);
  console.log('Blocked reports:', blocked);
  console.log('Blocked %:', total === 0 ? 0 : ((blocked / total) * 100).toFixed(4));
}

run().catch(err => { console.error(err); process.exit(2); });
