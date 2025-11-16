#!/usr/bin/env node
/* eslint-disable no-control-regex, no-irregular-whitespace */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.resolve(ROOT, 'src/data/products/all-products.ts');
const OUT = path.resolve(ROOT, 'reports/encoding_issues.csv');

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

function hasMojibake(str) {
  if (!str) return false;
  return /[]|/.test(String(str));
}

function auditProduct(p) {
  const issues = [];
  const fields = [
    'description',
    'detailedDescription',
    'mechanismOfAction',
    'dosage',
    'administrationMethod',
  ];
  for (const f of fields) {
    if (hasMojibake(p[f])) issues.push(f);
  }
  return issues;
}

function main() {
  const ts = fs.readFileSync(FILE, 'utf8');
  const products = extract(ts);
  const rows = ['id,name,fields_with_encoding_issues'];
  for (const p of products) {
    const issues = auditProduct(p);
    if (issues.length > 0)
      rows.push(
        [
          JSON.stringify(p.id || ''),
          JSON.stringify(p.name || ''),
          JSON.stringify(issues.join('|')),
        ].join(',')
      );
  }
  fs.writeFileSync(OUT, rows.join('\n'), 'utf8');
  console.log(
    'Encoding audit:',
    OUT,
    `(${rows.length - 1} productos con incidencias)`
  );
}

if (require.main === module) {
  main();
}
