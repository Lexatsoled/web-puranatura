#!/usr/bin/env node
/**
 * Genera un CSV de auditoría de componentes:
 * - Señala productos con componentes cuyo amount está vacío.
 * - Señala si contiene el placeholder "Ver etiqueta del producto".
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.resolve(ROOT, 'src/data/products/all-products.ts');
const OUT = path.resolve(ROOT, 'reports/components_audit.csv');

function extractArrayLiteral(ts) {
  const startKey = 'export const products';
  const i0 = ts.indexOf(startKey);
  const eq = ts.indexOf('=', i0);
  let i = ts.indexOf('[', eq);
  let depth = 0;
  for (; i < ts.length; i++) {
    const ch = ts[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  return ts.slice(ts.indexOf('[', eq), i);
}

function main() {
  const ts = fs.readFileSync(FILE, 'utf8');
  const arr = JSON.parse(extractArrayLiteral(ts));
  const rows = ['id,name,has_placeholder,empty_amounts,total_components'];
  for (const p of arr) {
    const comps = Array.isArray(p.components) ? p.components : [];
    const total = comps.length;
    const empty = comps.filter(
      (c) => c && typeof c.amount === 'string' && c.amount.trim() === ''
    ).length;
    const hasPlaceholder = comps.some(
      (c) => c && /ver etiqueta del producto/i.test(c.name || '')
    );
    if (empty > 0 || hasPlaceholder) {
      rows.push(
        [
          JSON.stringify(p.id || ''),
          JSON.stringify(p.name || ''),
          hasPlaceholder ? 1 : 0,
          empty,
          total,
        ].join(',')
      );
    }
  }
  fs.writeFileSync(OUT, rows.join('\n'), 'utf8');
  console.log(
    'Generado:',
    OUT,
    `(${rows.length - 1} productos con incidencias)`
  );
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
