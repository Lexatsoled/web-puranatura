#!/usr/bin/env node
/**
 * Rellena cantidades en Componentes a partir de la web antigua.
 * - Para productos cuyo `components[].amount` esté vacío, busca el producto correspondiente
 *   en la web antigua y copia `amount` (y description si falta) para el componente con
 *   nombre coincidente (normalizado).
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const NEW_FILE = path.resolve(ROOT, 'src/data/products/all-products.ts');
const OLD_FILE = path.resolve(
  __dirname,
  '../../web-puranatura---terapias-naturales/src/data/products.ts'
);
const OLD_FILE_ALL = path.resolve(
  __dirname,
  '../../web-puranatura---terapias-naturales/src/data/products/all-products.ts'
);

function extractArrayLiteral(ts) {
  const startKey = 'export const products';
  const i0 = ts.indexOf(startKey);
  if (i0 === -1) throw new Error('No se encontró export const products');
  const eq = ts.indexOf('=', i0);
  if (eq === -1) throw new Error('No se encontró =');
  let i = ts.indexOf('[', eq);
  if (i === -1) throw new Error('No se encontró inicio del array');
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
  return {
    arr: ts.slice(ts.indexOf('[', eq), i),
    start: ts.indexOf('[', eq),
    end: i,
  };
}

function parseProductsFromTS(file) {
  const ts = fs.readFileSync(file, 'utf8');
  const { arr } = extractArrayLiteral(ts);
  // Intentar primero como JSON
  try {
    return JSON.parse(arr);
  } catch (error) {
    console.error(error);
  }
  // Evaluar como JS en sandbox
  const sandbox = { module: { exports: {} } };
  vm.createContext(sandbox);
  const code = `module.exports = ${arr};`;
  vm.runInContext(code, sandbox, {
    timeout: 5000,
    filename: path.basename(file),
  });
  const out = sandbox.module.exports;
  if (!Array.isArray(out)) throw new Error('No es un array de productos');
  return out;
}

function normalize(s) {
  return (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase();
}

function indexOldProducts(products) {
  const byId = new Map();
  const byName = new Map();
  for (const p of products) {
    if (p?.id) byId.set(p.id, p);
    if (p?.name) byName.set(normalize(p.name), p);
  }
  return { byId, byName };
}

function main() {
  const newProducts = parseProductsFromTS(NEW_FILE);
  const oldA = parseProductsFromTS(OLD_FILE);
  let oldB = [];
  try {
    oldB = parseProductsFromTS(OLD_FILE_ALL);
  } catch (error) { console.error(error); }
  const idxA = indexOldProducts(oldA);
  const idxB = indexOldProducts(oldB);

  let updated = 0,
    filledAmounts = 0,
    filledDescs = 0;
  for (const p of newProducts) {
    if (!p.components || p.components.length === 0) continue;
    const hasEmpty = p.components.some(
      (c) => c && typeof c.amount === 'string' && c.amount.trim() === ''
    );
    if (!hasEmpty) continue;
    const normName = normalize(p.name);
    let old =
      (p.id && (idxA.byId.get(p.id) || idxB.byId.get(p.id))) ||
      idxA.byName.get(normName) ||
      idxB.byName.get(normName);
    if (!old || !old.components) continue;
    const oldCompMap = new Map();
    for (const oc of old.components) {
      if (!oc?.name) continue;
      oldCompMap.set(normalize(oc.name), oc);
    }
    let changed = false;
    // Si el nuevo tiene solo un placeholder "Ver etiqueta del producto", reemplazar por completo si el antiguo tiene componentes reales
    const isPlaceholderOnly =
      p.components.length === 1 &&
      /ver etiqueta del producto/i.test(p.components[0]?.name || '');
    if (
      isPlaceholderOnly &&
      Array.isArray(old.components) &&
      old.components.length > 0
    ) {
      // clonar para evitar referencias
      p.components = old.components.map((oc) => ({
        name: oc.name,
        description: oc.description,
        amount: oc.amount || '',
      }));
      updated++; // contamos directamente
      continue;
    }
    for (const c of p.components) {
      if (!c?.name) continue;
      const k = normalize(c.name);
      const oc = oldCompMap.get(k);
      if (!oc) continue;
      if ((!c.amount || c.amount.trim() === '') && oc.amount) {
        c.amount = oc.amount;
        filledAmounts++;
        changed = true;
      }
      if ((!c.description || c.description.trim() === '') && oc.description) {
        c.description = oc.description;
        filledDescs++;
        changed = true;
      }
    }
    if (changed) updated++;
  }

  if (updated > 0) {
    const ts = fs.readFileSync(NEW_FILE, 'utf8');
    const { start, end } = extractArrayLiteral(ts);
    const json = JSON.stringify(newProducts, null, 2);
    fs.writeFileSync(NEW_FILE + '.bak', ts, 'utf8');
    fs.writeFileSync(
      NEW_FILE,
      ts.slice(0, start) + json + ts.slice(end),
      'utf8'
    );
  }
  console.log(
    `Productos actualizados: ${updated}, amounts rellenados: ${filledAmounts}, descripciones: ${filledDescs}`
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
