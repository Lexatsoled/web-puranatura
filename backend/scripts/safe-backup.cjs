const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

// Default DATABASE_URL if not set
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
}

const prisma = new PrismaClient();
const arg = process.argv.find((a) => a.startsWith('--out='));
// Formato: dev-YYYYMMDD-HHMMSS.db (sin caracteres conflictivos)
const defaultName = (() => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  const H = pad(now.getHours());
  const M = pad(now.getMinutes());
  const S = pad(now.getSeconds());
  return `dev-${y}${m}${d}-${H}${M}${S}.db`;
})();
const outPath = arg ? arg.split('=')[1] : path.join('backups', defaultName);
fs.mkdirSync(path.dirname(outPath), { recursive: true });

async function main() {
  await prisma.$executeRawUnsafe(`VACUUM INTO '${outPath}'`);
  console.log(`[safe-backup] Backup creado: ${outPath}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('[safe-backup] Error:', err);
  process.exit(1);
});
