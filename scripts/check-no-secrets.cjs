#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const checks = [
  '.env',
  'backend/.env',
  'backend/database.sqlite',
  'backend/database.sqlite.backup',
  'backend/backups',
  'backend/out.log',
  'backend/logs',
];

let found = [];
for (const p of checks) {
  const full = path.join(repoRoot, p);
  if (fs.existsSync(full)) {
    found.push(p);
  }
}

if (found.length > 0) {
  console.error(
    '[check-no-secrets] Se detectaron archivos sensibles en el repositorio:'
  );
  found.forEach((f) => console.error('  -', f));
  console.error(
    '\nPor seguridad, elimina estos archivos del repositorio y purga el historial (BFG/git filter-repo).'
  );
  console.error(
    'Asegúrate de rotar las claves/secretos afectados (JWT, provider API keys, etc.).'
  );
  process.exit(1);
}

console.log(
  '[check-no-secrets] OK — No se han detectado archivos sensibles en la raíz del repo.'
);
