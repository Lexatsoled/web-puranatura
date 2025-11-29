#!/usr/bin/env node
// scripts/cleanup-prisma-tmp.cjs
// Elimina restos temporales del cliente nativo de Prisma que pueden causar
// fallos (EPERM) en entornos Windows/CI cuando el query engine intenta renombrar.
const fs = require('fs');
const path = require('path');

function removeTmpFiles(baseDir) {
  if (!fs.existsSync(baseDir)) return 0;
  let removed = 0;
  const files = fs.readdirSync(baseDir);
  for (const f of files) {
    const full = path.join(baseDir, f);
    if (f.includes('.tmp') || f.endsWith('.tmp')) {
      try { fs.unlinkSync(full); removed++; } catch (err) { /* best-effort */ }
    } else {
      // Recurse into directories
      try { if (fs.statSync(full).isDirectory()) removed += removeTmpFiles(full); } catch (err) {}
    }
  }
  return removed;
}

const candidates = [
  path.join(__dirname, '..', 'backend', 'node_modules', '.prisma', 'client'),
  path.join(__dirname, '..', 'backend', 'node_modules', '@prisma', 'client'),
  path.join(__dirname, '..', 'node_modules', '.prisma', 'client'),
  path.join(__dirname, '..', 'node_modules', '@prisma', 'client')
];

let total = 0;
for (const c of candidates) {
  const n = removeTmpFiles(c);
  if (n > 0) console.log(`removed ${n} tmp files from ${c}`);
  total += n;
}

if (total === 0) console.log('No Prisma .tmp files found');
else console.log(`Removed ${total} Prisma .tmp files`);

process.exit(0);
