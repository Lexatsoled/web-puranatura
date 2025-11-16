#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.resolve(ROOT, 'src/data/products/all-products.ts');

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
  return {
    arr: ts.slice(ts.indexOf('[', eq), i),
    start: ts.indexOf('[', eq),
    end: i,
  };
}

function setComponents(id, components) {
  const ts = fs.readFileSync(FILE, 'utf8');
  const { arr, start, end } = extract(ts);
  const products = JSON.parse(arr);
  const p = products.find((x) => x.id === id);
  if (!p) throw new Error('Producto no encontrado: ' + id);
  p.components = components;
  const json = JSON.stringify(products, null, 2).replace(/"/g, '"');
  fs.writeFileSync(FILE + '.bak', ts, 'utf8');
  fs.writeFileSync(FILE, ts.slice(0, start) + json + ts.slice(end), 'utf8');
}

if (require.main === module) {
  const id = process.argv[2];
  if (!id) {
    console.error('Uso: node tools/set_components.cjs <id>');
    process.exit(1);
  }
  let arg = process.argv[3] || '[]';
  if (arg.startsWith('@')) {
    const p = arg.slice(1);
    arg = fs.readFileSync(p, 'utf8');
    if (arg.charCodeAt(0) === 0xfeff) {
      arg = arg.slice(1);
    }
  }
  const comps = JSON.parse(arg);
  setComponents(id, comps);
  console.log('Actualizado components de', id);
}
