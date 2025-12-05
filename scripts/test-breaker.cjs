const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BREAKER_TEST_URL || 'http://localhost:3001';
const DB_PATH = path.join(__dirname, '..', 'backend', 'prisma', 'dev.db');
const DB_BAK = path.join(__dirname, '..', 'backend', 'prisma', 'dev.db.bak');
const REQUESTS_OPEN = 10;
const REQUESTS_RECOVER = 3;
const OPEN_TIMEOUT_MS = Number(process.env.BREAKER_OPEN_TIMEOUT || 60000);

function requestProducts() {
  return new Promise((resolve) => {
    const req = http.get(`${BASE_URL}/api/products`, (res) => {
      res.resume();
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(0));
  });
}

async function sendMany(n) {
  const results = [];
  for (let i = 0; i < n; i++) {
    const status = await requestProducts();
    results.push(status);
  }
  return results;
}

function renameDb(toBak) {
  if (toBak) {
    if (fs.existsSync(DB_BAK)) fs.unlinkSync(DB_BAK);
    if (fs.existsSync(DB_PATH)) fs.renameSync(DB_PATH, DB_BAK);
  } else {
    if (fs.existsSync(DB_BAK)) fs.renameSync(DB_BAK, DB_PATH);
  }
}

(async () => {
  console.log('[breaker-test] Paso 1: baseline (debe responder 200)');
  const baseline = await sendMany(3);
  console.log('baseline statuses:', baseline);

  console.log('[breaker-test] Paso 2: simular ca?da DB');
  renameDb(true);
  const openStatuses = await sendMany(REQUESTS_OPEN);
  console.log('open statuses:', openStatuses);

  console.log('[breaker-test] Paso 3: restaurar DB y esperar HALF_OPEN');
  renameDb(false);
  console.log(`esperando ${OPEN_TIMEOUT_MS}ms...`);
  await new Promise((r) => setTimeout(r, OPEN_TIMEOUT_MS));
  const recoverStatuses = await sendMany(REQUESTS_RECOVER);
  console.log('recover statuses:', recoverStatuses);

  const summary = {
    baseline200: baseline.every((s) => s === 200),
    any503InOpen: openStatuses.some((s) => s === 503),
    recover200: recoverStatuses.every((s) => s === 200),
  };
  console.log('[breaker-test] Resumen:', summary);

  // Cleanup: si db qued? movida, restaurar
  if (fs.existsSync(DB_BAK) && !fs.existsSync(DB_PATH)) {
    fs.renameSync(DB_BAK, DB_PATH);
  }
})();
