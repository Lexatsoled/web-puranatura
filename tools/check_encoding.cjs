#!/usr/bin/env node
/*
  check_encoding.cjs
  - Pre-commit: escanea archivos staged.
  - CI: escanea todos los archivos versionados (git ls-files) limitados a src/ y test/.
  Falla si detecta mojibake (Ã, Â, â, �) o patrones comunes de acentos rotos.
*/
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css']);
const suspectRe = /[ÃÂâ�]|InformaciÃ³n|DescripciÃ³n|acciÃ³n|pÃºblico|opciÃ³n|paÃ­s|niÃ±o/g;

function isMonitored(file) {
  const rel = file.replace(/\\/g, '/');
  return rel.startsWith('src/') || rel.startsWith('test/');
}

function listStaged() {
  const out = execSync('git diff --cached --name-only --diff-filter=ACM', {
    stdio: ['ignore', 'pipe', 'ignore'],
  }).toString('utf8');
  return out.split(/\r?\n/).filter(Boolean);
}

function listAllTracked() {
  try {
    const out = execSync('git ls-files', { stdio: ['ignore', 'pipe', 'ignore'] }).toString('utf8');
    return out.split(/\r?\n/).filter(Boolean);
  } catch {
    return [];
  }
}

function scan(file) {
  const ext = path.extname(file).toLowerCase();
  if (!exts.has(ext)) return null;
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
  const matches = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (suspectRe.test(line)) {
      matches.push({ line: i + 1, snippet: line.slice(0, 140) });
    }
    suspectRe.lastIndex = 0;
  }
  return matches.length ? { file, matches } : null;
}

function main() {
  let files = listStaged();
  const inCI = !!process.env.CI;
  if (inCI || files.length === 0) files = listAllTracked();

  // En CI limitamos a src/ y test/ para evitar falsos positivos en docs/reportes
  const scope = inCI ? files.filter(isMonitored) : files;
  const problems = [];
  for (const f of scope) {
    const res = scan(f);
    if (res) problems.push(res);
  }
  if (problems.length) {
    console.error(`\n[encoding] Se detectó posible mojibake en ${problems.length} archivo(s):`);
    for (const p of problems) {
      console.error(`\n- ${p.file}`);
      p.matches.slice(0, 5).forEach((m) => console.error(`  L${m.line}: ${m.snippet}`));
      if (p.matches.length > 5) console.error(`  ... y ${p.matches.length - 5} más`);
    }
    console.error('\nSugerencias:');
    console.error('  - Reemplace “Ã/Â/â/�” por acentos reales (áéíóúñ).');
    console.error('  - O ejecute: npm run fix-encoding (y luego git add).');
    process.exit(1);
  }
}

main();
