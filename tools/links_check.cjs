#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.resolve(ROOT, 'src/data/products/all-products.ts');
const OUT = path.resolve(ROOT, 'reports/links_check.csv');

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

async function head(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.ok) return { ok: true, status: res.status };
    // some endpoints don't allow HEAD; try GET with small timeout
    const res2 = await fetch(url, { method: 'GET' });
    return { ok: res2.ok, status: res2.status };
  } catch (e) {
    return { ok: false, status: 0, err: (e && e.message) || String(e) };
  }
}

function buildUrlFromDOI(doi) {
  if (!doi) return null;
  return 'https://doi.org/' + doi;
}

async function main() {
  const ts = fs.readFileSync(FILE, 'utf8');
  const products = extract(ts);
  const rows = ['id,name,ref_index,url,status,ok'];
  for (const p of products) {
    if (!Array.isArray(p.scientificReferences)) continue;
    let idx = 0;
    for (const r of p.scientificReferences) {
      const urls = [];
      if (r.url) urls.push(r.url);
      const doiUrl = buildUrlFromDOI(r.doi);
      if (doiUrl) urls.push(doiUrl);
      for (const u of urls) {
        const res = await head(u);
        rows.push(
          [
            JSON.stringify(p.id || ''),
            JSON.stringify(p.name || ''),
            idx,
            JSON.stringify(u),
            res.status,
            res.ok ? 1 : 0,
          ].join(',')
        );
      }
      idx++;
    }
  }
  fs.writeFileSync(OUT, rows.join('\n'), 'utf8');
  console.log('Link check:', OUT, `(${rows.length - 1} urls)`);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
