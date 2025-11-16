#!/usr/bin/env node
/*
  strip-bom.cjs
  - Elimina UTF-8 BOM (EF BB BF) o caracteres de reemplazo EF BF BD repetidos
    al inicio de archivos .ts/.tsx que rompen el parser ("Unexpected �").
*/
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const exts = new Set(['.ts', '.tsx']);
const skipDirs = new Set(['node_modules', '.git', 'dist', 'coverage', 'playwright-report', 'test-results']);

function fixLeadingBytes(buf) {
  let i = 0;
  // Remove UTF-8 BOM
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    i = 3;
  }
  // Remove any leading U+FFFD (replacement char) sequences (EF BF BD)
  while (buf.length - i >= 3 && buf[i] === 0xef && buf[i + 1] === 0xbf && buf[i + 2] === 0xbd) {
    i += 3;
  }
  return i > 0 ? buf.slice(i) : null;
}

function walk(dir) {
  if (skipDirs.has(path.basename(dir))) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (exts.has(path.extname(entry.name))) {
      try {
        const buf = fs.readFileSync(full);
        const fixed = fixLeadingBytes(buf);
        if (fixed) {
          fs.writeFileSync(full, fixed);
          console.log('Stripped leading BOM/replacement:', full);
        }
      } catch {
        // ignore
      }
    }
  }
}

walk(root + '/src');
console.log('BOM cleanup completed.');

