#!/usr/bin/env node
/**
 * Descarga páginas fuente (Piping Rock) para productos mapeados
 * según web-puranatura---terapias-naturales/REFERENCIAS_IMAGENES_PIPING_ROCK.md
 * y las guarda en reports/sources/{id}.html
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MAP_FILE = path.resolve(
  __dirname,
  '../../web-puranatura---terapias-naturales/REFERENCIAS_IMAGENES_PIPING_ROCK.md'
);
const OUT_DIR = path.resolve(ROOT, 'reports/sources');
const PRODUCTS_FILE = path.resolve(ROOT, 'src/data/products/all-products.ts');

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'PurezaNaturalisBot/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.text();
}

function getProductIds() {
  const ts = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  const ids = [...ts.matchAll(/"id"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  return new Set(ids);
}

function parseMap(md) {
  const lines = md.split(/\r?\n/);
  const entries = [];
  let currentId = null;
  let currentUrl = null;
  for (const line of lines) {
    const idMatch = line.match(/ID del producto:\s*`([^`]+)`/);
    if (idMatch) {
      currentId = idMatch[1];
      continue;
    }
    const urlMatch = line.match(/URL del producto:\s*`([^`]+)`/);
    if (urlMatch) {
      currentUrl = urlMatch[1];
    }
    if (currentId && currentUrl) {
      entries.push({ id: currentId, url: currentUrl });
      currentId = null;
      currentUrl = null;
    }
  }
  return entries;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const md = fs.readFileSync(MAP_FILE, 'utf8');
  const entries = parseMap(md);
  const productIds = getProductIds();
  let done = 0,
    skipped = 0,
    errors = 0;
  for (const { id, url } of entries) {
    if (!productIds.has(id)) {
      skipped++;
      continue;
    }
    const outPath = path.join(OUT_DIR, `${id}.html`);
    if (fs.existsSync(outPath)) {
      skipped++;
      continue;
    }
    try {
      const html = await fetchText(url);
      fs.writeFileSync(outPath, html, 'utf8');
      done++;
    } catch (e) {
      errors++;
      fs.writeFileSync(
        path.join(OUT_DIR, `${id}.error.txt`),
        `URL: ${url}\n${e.stack || e.message}`,
        'utf8'
      );
    }
  }
  console.log(
    `Descargas completadas: ${done}, omitidas: ${skipped}, errores: ${errors}`
  );
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
