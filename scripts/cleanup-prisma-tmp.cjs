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

// Allow overriding candidate directories from an environment variable for
// testability and flexible CI usage. Provide a JSON array in
// PRISMA_TMP_CANDIDATES, or fallback to the default list.
let candidates = [];
if (process.env.PRISMA_TMP_CANDIDATES) {
  try {
    const parsed = JSON.parse(process.env.PRISMA_TMP_CANDIDATES);
    if (Array.isArray(parsed)) candidates = parsed.map((p) => path.resolve(p));
  } catch (e) {
    // fall back to default if parsing fails
    console.warn('PRISMA_TMP_CANDIDATES parse failed, using default paths');
  }
}

if (!candidates.length) {
  candidates = [
    path.join(__dirname, '..', 'backend', 'node_modules', '.prisma', 'client'),
    path.join(__dirname, '..', 'backend', 'node_modules', '@prisma', 'client'),
    path.join(__dirname, '..', 'node_modules', '.prisma', 'client'),
    path.join(__dirname, '..', 'node_modules', '@prisma', 'client'),
  ];
}

let total = 0;
for (const c of candidates) {
  const n = removeTmpFiles(c);
  if (n > 0) console.log(`removed ${n} tmp files from ${c}`);
  total += n;
}

if (total === 0) console.log('No Prisma .tmp files found');
else console.log(`Removed ${total} Prisma .tmp files`);

process.exit(0);
