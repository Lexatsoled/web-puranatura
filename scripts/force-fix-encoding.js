#!/usr/bin/env node
/**
 * Forzado: reinterpreta archivos sospechosos como latin1 -> utf8 y escribe backups (*.bak).
 * Es menos conservador que fix-encoding.js y reescribe cuando la transformación mejora
 * la presencia de acentos y/o reduce claramente patrones de mojibake.
 */
import fs from 'fs';
import path from 'path';

const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.txt', '.css']);
const skipDirs = new Set(['node_modules', '.git', 'dist', 'playwright-report', 'test-results', 'coverage']);

const looksMojibake = (s) => /[ÃÂâ�├Ô]/.test(s) || /InformaciÃ³n|DescripciÃ³n|opciÃ³n|cuÃ¡|niÃ±|mÃ¡s|pÃº|tÃ­tulo/.test(s);
const scoreMojibake = (s) => (s.match(/[ÃÂâ�├Ô]/g) || []).length + (s.match(/Ãƒ|Ã¢|Ã©|Ã³|Ã¡/g) || []).length;
const countAccents = (s) => (s.match(/[áéíóúñÁÉÍÓÚÑ]/g) || []).length;

function repairLatin1Utf8(orig) {
  try {
    // Interpretar la cadena original como latin1 y obtener utf8
    const decoded = Buffer.from(orig, 'latin1').toString('utf8');
    return decoded;
  } catch (e) {
    return orig;
  }
}

function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!exts.has(ext)) return null;
  let orig;
  try {
    orig = fs.readFileSync(file, 'utf8');
  } catch (e) {
    return null;
  }

  if (!looksMojibake(orig)) return null;

  const before = scoreMojibake(orig);
  const accentsBefore = countAccents(orig);

  const fixed = repairLatin1Utf8(orig);
  const after = scoreMojibake(fixed);
  const accentsAfter = countAccents(fixed);

  // Condición menos conservadora: aceptar si reduce mojibake o aumenta acentos
  if (fixed !== orig && (after < before || accentsAfter > accentsBefore)) {
    try {
      fs.copyFileSync(file, file + '.bak');
      fs.writeFileSync(file, fixed, 'utf8');
      console.log(`Fixed (${before}→${after}, accents ${accentsBefore}→${accentsAfter}):`, file);
      return file;
    } catch (e) {
      console.error('Failed to write', file, e.message);
      return null;
    }
  }
  return null;
}

function walk(dir, results = []) {
  const base = path.basename(dir);
  if (skipDirs.has(base)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else {
      const r = processFile(full);
      if (r) results.push(r);
    }
  }
  return results;
}

const start = process.cwd();
const changed = walk(start, []);
console.log('Encoding force-fix completed. Files changed:', changed.length);
if (changed.length > 0) changed.forEach(f => console.log('  -', f));
