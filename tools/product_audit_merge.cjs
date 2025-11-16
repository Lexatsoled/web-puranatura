#!/usr/bin/env node
/**
 * Auditoría y fusión de productos entre la web antigua y la nueva.
 * - Compara productos por nombre (y fallback por id) entre:
 *   - antigua: web-puranatura---terapias-naturales/src/data/products.ts
 *   - nueva:   Pureza-Naturalis-V3/src/data/products/all-products.ts
 * - Rellena en la nueva los campos faltantes tomando de la antigua:
 *   detailedDescription, mechanismOfAction, benefitsDescription, healthIssues,
 *   components, dosage, administrationMethod, faqs, scientificReferences.
 * - Detecta desalineación nombre ↔ imagen y puede sugerir renombres.
 * - Genera reporte CSV y backup del archivo original antes de sobrescribir.
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
const REPORT_DIR = path.resolve(ROOT, 'reports');
const REPORT_CSV = path.resolve(REPORT_DIR, 'product_audit.csv');
const CHANGELOG = path.resolve(REPORT_DIR, 'product_changes.log');

function readFileSafe(p) {
  return fs.readFileSync(p, 'utf8');
}

function tsProductsToArray(tsContent, debugLabel = 'data') {
  // Extrae literal del array de products sin ejecutar el resto del archivo
  // Busca 'products' seguido de '=' y '['
  const exportIdx = tsContent.indexOf('products');
  if (exportIdx === -1) throw new Error('No se encontró la sección products.');
  // Encuentra el primer '[' después del '=' de products
  const eqIdx = tsContent.indexOf('=', exportIdx);
  if (eqIdx === -1)
    throw new Error('No se encontró el igual (=) para products.');
  let arrStart = tsContent.indexOf('[', eqIdx);
  if (arrStart === -1)
    throw new Error('No se encontró inicio de array para products.');
  // Recorre balance de corchetes para encontrar el final correspondiente
  let i = arrStart;
  let depth = 0;
  for (; i < tsContent.length; i++) {
    const ch = tsContent[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        break;
      }
    }
  }
  if (depth !== 0)
    throw new Error('No se pudo balancear corchetes del array products.');
  const arrLiteral = tsContent.slice(arrStart, i + 1);

  const code = `module.exports = ${arrLiteral};`;
  const dbgPath = path.resolve(REPORT_DIR, `debug_${debugLabel}.ts`);
  try {
    fs.writeFileSync(dbgPath, code, 'utf8');
  } catch (e) { console.error(e); }
  const sandbox = { module: { exports: {} } };
  vm.createContext(sandbox);
  try {
    vm.runInContext(code, sandbox, {
      timeout: 5000,
      filename: `eval-${debugLabel}.ts`,
    });
  } catch (e) {
    throw new Error('Error evaluando contenido TS: ' + e.message);
  }
  const out = sandbox.module
    ? sandbox.module.exports
    : sandbox.exports || sandbox;
  if (!out || !Array.isArray(out)) {
    throw new Error('No se pudo extraer el array de productos.');
  }
  return out;
}

function normalizeName(s) {
  return (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase();
}

function basenameNoExt(p) {
  const base = path.basename(p || '').replace(/\.(webp|jpg|jpeg|png)$/i, '');
  return base;
}

function suggestNameFromImages(images) {
  if (!Array.isArray(images)) return null;
  const bases = images
    .map((img) => (img && (img.full || img.thumbnail)) || '')
    .filter(Boolean)
    .map((p) => {
      let b = basenameNoExt(p);
      // eliminar sufijos comunes con diferentes separadores
      b = b.replace(/[ _-]*(Anverso|Reverso|Etiqueta)[ _-]*$/i, '');
      return b;
    });
  if (!bases.length) return null;
  // pick the most frequent base
  const freq = new Map();
  for (const b of bases) freq.set(b, (freq.get(b) || 0) + 1);
  let best = null;
  let bestC = 0;
  for (const [b, c] of freq) {
    if (c > bestC) {
      best = b;
      bestC = c;
    }
  }
  return best || null;
}

function loadProducts(filePath, label) {
  const content = readFileSafe(filePath);
  return tsProductsToArray(content, label);
}

function indexByNameAndId(arr) {
  const byName = new Map();
  const byId = new Map();
  for (const p of arr) {
    if (p && p.name) byName.set(normalizeName(p.name), p);
    if (p && p.id) byId.set(p.id, p);
  }
  return { byName, byId };
}

function auditAndMerge() {
  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
  const oldProducts = loadProducts(OLD_FILE, 'old');
  let oldProductsAll = [];
  try {
    oldProductsAll = loadProducts(OLD_FILE_ALL, 'old_all');
  } catch {
    // opcional
  }
  const newProducts = loadProducts(NEW_FILE, 'new');
  const oldIdx = indexByNameAndId(oldProducts);
  const oldIdxAll = indexByNameAndId(oldProductsAll);

  const fields = [
    'detailedDescription',
    'mechanismOfAction',
    'benefitsDescription',
    'healthIssues',
    'components',
    'dosage',
    'administrationMethod',
    'faqs',
    'scientificReferences',
  ];

  const csvRows = [];
  csvRows.push(
    [
      'id',
      'name_before',
      'name_after',
      'matched_old',
      ...fields.map((f) => `${f}_new_has`),
      ...fields.map((f) => `${f}_old_has`),
      ...fields.map((f) => `${f}_merged`),
      'image_name_mismatch',
    ].join(',')
  );

  const changes = [];
  for (const p of newProducts) {
    const beforeName = p.name || '';
    const norm = normalizeName(p.name);
    let old = oldIdx.byName.get(norm);
    if (!old && p.id) old = oldIdx.byId.get(p.id);
    // fallback: buscar en all-products viejo si no hay match
    if (!old) {
      old =
        oldIdxAll.byName.get(norm) ||
        (p.id ? oldIdxAll.byId.get(p.id) : undefined);
    }
    const matchedOld = !!old;

    // Suggest/auto-fix name from images when clear
    let imageNameMismatch = 'no';
    const suggested = suggestNameFromImages(p.images || []);
    if (suggested) {
      const normSuggested = normalizeName(suggested);
      if (normSuggested && normSuggested !== norm) {
        // Update name to suggested
        p.name = suggested;
        imageNameMismatch = 'renamed';
        changes.push(`Renombrado: id=${p.id} '${beforeName}' -> '${p.name}'`);
      }
    }

    const mergedFlags = {};
    for (const f of fields) {
      const newHas =
        p[f] != null &&
        (Array.isArray(p[f])
          ? p[f].length > 0
          : String(p[f]).trim().length > 0);
      const oldHas =
        matchedOld &&
        old[f] != null &&
        (Array.isArray(old[f])
          ? old[f].length > 0
          : String(old[f]).trim().length > 0);
      let merged = false;
      if (!newHas && oldHas) {
        p[f] = old[f];
        merged = true;
        if (f === 'scientificReferences') {
          changes.push(
            `Referencias añadidas: id=${p.id} (${(old[f] || []).length} refs)`
          );
        }
      }
      mergedFlags[f] = { newHas, oldHas, merged };
    }

    csvRows.push(
      [
        JSON.stringify(p.id || ''),
        JSON.stringify(beforeName),
        JSON.stringify(p.name || ''),
        matchedOld ? 'yes' : 'no',
        ...fields.map((f) => (mergedFlags[f].newHas ? '1' : '0')),
        ...fields.map((f) => (mergedFlags[f].oldHas ? '1' : '0')),
        ...fields.map((f) => (mergedFlags[f].merged ? '1' : '0')),
        imageNameMismatch,
      ].join(',')
    );
  }

  // Write CSV
  fs.writeFileSync(REPORT_CSV, csvRows.join('\n'), 'utf8');
  // Write change log
  fs.writeFileSync(CHANGELOG, changes.join('\n'), 'utf8');

  return { newProducts, changesCount: changes.length };
}

function writeUpdatedNewFile(products) {
  // Read original file to preserve header and formatting as much as possible
  const original = readFileSafe(NEW_FILE);
  const startIdx = original.indexOf('export const products');
  if (startIdx === -1)
    throw new Error(
      'No se encontró la exportación de products en el archivo nuevo.'
    );
  const prefix = original.slice(0, startIdx);
  // const suffix = '];\n\n'; // we'll ensure proper closing

  // Serialize products array as pretty TS
  const serialized = JSON.stringify(products, null, 2).replace(/"/g, '"');

  const newContent = `${prefix}export const products: Product[] = ${serialized};\n`;
  // Backup
  const backupPath = NEW_FILE + '.bak';
  fs.writeFileSync(backupPath, original, 'utf8');
  fs.writeFileSync(NEW_FILE, newContent, 'utf8');
  return backupPath;
}

function main() {
  console.log('⏳ Ejecutando auditoría y fusión de productos...');
  const { newProducts, changesCount } = auditAndMerge();
  console.log(`✅ Auditoría completada. Cambios detectados: ${changesCount}`);
  console.log(`📄 Reporte CSV: ${REPORT_CSV}`);
  console.log(`📝 Log de cambios: ${CHANGELOG}`);
  const backup = writeUpdatedNewFile(newProducts);
  console.log(`💾 Backup creado: ${backup}`);
  console.log('🎯 Archivo actualizado: ' + NEW_FILE);
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}
