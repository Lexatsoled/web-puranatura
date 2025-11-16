#!/usr/bin/env node
/**
 * Normaliza URLs de referencias científicas:
 * - Si existe `pmid` y no hay `url` o la `url` no es PubMed, establece `url` a PubMed.
 * - Mantiene `doi` sin cambios.
 */
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

function main() {
  const ts = fs.readFileSync(FILE, 'utf8');
  const { arr, start, end } = extract(ts);
  const products = JSON.parse(arr);
  let updates = 0;
  for (const p of products) {
    if (!Array.isArray(p.scientificReferences)) continue;
    for (const r of p.scientificReferences) {
      if (r && r.pmid) {
        const pubmed = `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`;
        if (!r.url || !/pubmed\.ncbi\.nlm\.nih\.gov/.test(r.url)) {
          r.url = pubmed;
          updates++;
        }
      }
    }
  }
  if (updates > 0) {
    const json = JSON.stringify(products, null, 2).replace(/"/g, '"');
    fs.writeFileSync(FILE + '.bak', ts, 'utf8');
    fs.writeFileSync(FILE, ts.slice(0, start) + json + ts.slice(end), 'utf8');
  }
  console.log('Referencias normalizadas:', updates);
}

if (require.main === module) main();
