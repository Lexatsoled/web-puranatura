/*
  UTF-8 normalization for mojibake introduced by Latin-1/Windows-1252 mis-decodings.
  Strategy: detect suspicious patterns (Ã, Â, â, �) and try latin1->utf8 round-trip repair.
  Only rewrites files when the repair clearly reduces mojibake.
*/
import fs from 'fs';
import path from 'path';

const exts = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.html',
  '.txt',
  '.css',
]);
const skipDirs = new Set([
  'node_modules',
  '.git',
  'dist',
  'playwright-report',
  'test-results',
  'coverage',
]);

const looksMojibake = (s) =>
  /[ÃÂâ�]/.test(s) ||
  /InformaciÃ³n|DescripciÃ³n|opciÃ³n|cuÃ¡|niÃ±|mÃ¡s|pÃº|tÃ­tulo/.test(s);
const scoreMojibake = (s) =>
  (s.match(/[ÃÂâ�]/g) || []).length +
  (s.match(/Ãƒ|Ã¢|Ã©|Ã³|Ã¡/g) || []).length;
const countAccents = (s) => (s.match(/[áéíóúñÁÉÍÓÚÑ]/g) || []).length;

function repairLatin1Utf8(s) {
  // Attempt up to 2 passes to undo double-encoded sequences
  let cur = s;
  for (let i = 0; i < 2; i++) {
    try {
      if (!looksMojibake(cur)) break;
      const decoded = Buffer.from(cur, 'latin1').toString('utf8');
      if (decoded === cur) break;
      cur = decoded;
    } catch {
      break;
    }
  }
  return cur;
}

function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!exts.has(ext)) return;
  let orig;
  try {
    orig = fs.readFileSync(file, 'utf8');
  } catch {
    return;
  }

  if (!looksMojibake(orig)) return;
  const before = scoreMojibake(orig);
  const fixed = repairLatin1Utf8(orig);
  const after = scoreMojibake(fixed);
  const accentsBefore = countAccents(orig);
  const accentsAfter = countAccents(fixed);

  // Accept only if mojibake characters significantly decrease
  if (after < before && before - after >= 2 && accentsAfter >= accentsBefore) {
    fs.writeFileSync(file, fixed, 'utf8');
    console.log(`Fixed (${before}→${after}):`, file);
  }
}

function walk(dir) {
  if (skipDirs.has(path.basename(dir))) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else processFile(full);
  }
}

walk(process.cwd());
console.log('Encoding normalization completed.');
