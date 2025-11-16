#!/usr/bin/env node
/**
 * Auditor de texto básico para detectar posibles mojibake y errores comunes en español
 * dentro de src/data/products/all-products.ts. No modifica por defecto; genera CSV.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.resolve(ROOT, 'src/data/products/all-products.ts');
const OUT = path.resolve(ROOT, 'reports/text_audit.csv');

const suspectRegex = /(��|ǭ|�|\uFFFD)/;
const commonPairs = [
  ['cient��', 'cientí'],
  ['informaci��n', 'información'],
  ['revisi��n', 'revisión'],
  ['acci��n', 'acción'],
  ['funci��n', 'función'],
  ['absorci��n', 'absorción'],
  ['s��ntoma', 'síntoma'],
  ['d��a', 'día'],
  ['ser��n', 'serán'],
  ['est��n', 'están'],
  ['a��adidas', 'añadidas'],
  ['m��s', 'más'],
  ['p��rdida', 'pérdida'],
];

function extract(ts) {
  const key = 'export const products';
  const i0 = ts.indexOf(key);
  const eq = ts.indexOf('=', i0);
  let i = ts.indexOf('[', eq);
  let d = 0;
  for (; i < ts.length; i++) {
    const ch = ts[i];
    if (ch === '[') d++;
    else if (ch === ']') {
      d--;
      if (d === 0) {
        i++;
        break;
      }
    }
  }
  return JSON.parse(ts.slice(ts.indexOf('[', eq), i));
}

function main() {
  const ts = fs.readFileSync(FILE, 'utf8');
  const products = extract(ts);
  const rows = ['id,name,field,bad_snippet,suggestion'];
  for (const p of products) {
    const fields = [
      'description',
      'detailedDescription',
      'mechanismOfAction',
      'dosage',
      'administrationMethod',
    ];
    for (const f of fields) {
      const val = p[f];
      if (!val || typeof val !== 'string') continue;
      if (suspectRegex.test(val)) {
        let suggestion = '';
        for (const [bad, good] of commonPairs) {
          if (val.includes(bad)) suggestion = `${bad}→${good}`;
        }
        rows.push(
          [
            JSON.stringify(p.id || ''),
            JSON.stringify(p.name || ''),
            f,
            JSON.stringify(val.slice(0, 120)),
            JSON.stringify(suggestion),
          ].join(',')
        );
      }
    }
  }
  fs.writeFileSync(OUT, rows.join('\n'), 'utf8');
  console.log('Generado:', OUT);
}

if (require.main === module) main();
