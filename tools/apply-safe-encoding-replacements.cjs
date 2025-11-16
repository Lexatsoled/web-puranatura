#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();
const files = (execSync('git ls-files "src/**" "backend/src/**" "e2e/**"', { stdio: ['pipe', 'pipe', 'ignore'] }).toString('utf8').split(/\r?\n/)).filter(Boolean);

const replacements = [
  [/DESPUÃ‰S/g, 'DESPUÉS'],
  [/DESPUÃ‰S/g, 'DESPUÉS'],
  [/GalerÃ¯Â¿Â½a/g, 'Galería'],
  [/AÃ¯Â¿Â½adir/g, 'Añadir'],
  [/(\b|\B)AÃ¯Â¿Â½adir(\b|\B)/g, 'Añadir'],
  [/PestaÃ±as/g, 'Pestañas'],
  [/\bAÃ¯Â¿Â½\b/g, 'Añ'],
  [/mÃ¯Â¿Â½s/g, 'más'],
  [/mÃ¯¿Â½s/g, 'más'],
  [/Ã¼/g, 'ü'],
  [/En carrito \((\d+)\) - AÃ¯Â¿Â½adir/g, 'En carrito ($1) - Añadir'],
  [/\bÃ¡\b/g, 'á'],
  [/Ã¡/g, 'á'],
  [/Ã©/g, 'é'],
  [/Ã­/g, 'í'],
  [/Ã³/g, 'ó'],
  [/Ãº/g, 'ú'],
  [/Ã±/g, 'ñ'],
  [/Ã¼/g, 'ü'],
  [/mÃ¯Â¿Â½s/g, 'más'],
  [/\bAÃ¯Â¿Â½adir/g, 'Añadir'],
  [/Â°/g, '°'],
  [/â€œ/g, '“'],
  [/â€�/g, '”'],
  [/â€/g, '”'],
  [/â€“/g, '–'],
  [/Â®/g, '®'],
  [/Â©/g, '©'],
  [/Â¿/g, '¿'],
  [/Â¡/g, '¡'],
  [/\uFFFD/g, '�'],
];

function processFile(file) {
  const full = path.resolve(projectRoot, file);
  let txt;
  try {
    txt = fs.readFileSync(full, 'utf8');
  } catch (e) {
    return false;
  }
  let changed = txt;
  for (const [re, sub] of replacements) {
    changed = changed.replace(re, sub);
  }
  if (changed !== txt) {
    fs.writeFileSync(full + '.bak', txt, 'utf8');
    fs.writeFileSync(full, changed, 'utf8');
    console.log('Fixed:', file);
    return true;
  }
  return false;
}

let count = 0;
for (const f of files) {
  if (processFile(f)) count++;
}
console.log(`Processed ${files.length} files, modified ${count} files.`);
