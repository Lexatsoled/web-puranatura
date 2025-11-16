#!/usr/bin/env node
/*
  Limpia mojibake de 4 archivos clave con una estrategia agresiva pero segura:
  - Intenta reparaciones latin1->utf8 (hasta 2 pasadas)
  - Reemplaza caracteres de reemplazo/control y residuos Ã Â â
*/
const fs = require('fs');
const path = require('path');

const targets = [
  'src/components/ScientificReferences.tsx',
  'src/data/products.ts',
  'src/data/products/loader.ts',
  'src/pages/StorePage.tsx',
];

function score(text) {
  const bad = (text.match(/[\uFFFD]/g) || []).length + (text.match(/[ÃÂâ]/g) || []).length;
  const accents = (text.match(/[áéíóúñÁÉÍÓÚÑüÜ]/g) || []).length;
  return { bad, accents };
}
function repairOnce(s) {
  try { return Buffer.from(s, 'latin1').toString('utf8'); } catch { return s; }
}
function bestRepair(original) {
  const candidates = [original];
  let cur = original;
  for (let i = 0; i < 2; i++) { cur = repairOnce(cur); candidates.push(cur); }
  let best = candidates[0], bestS = score(best);
  for (const c of candidates.slice(1)) {
    const sc = score(c);
    if (sc.bad < bestS.bad || (sc.bad === bestS.bad && sc.accents > bestS.accents)) {
      best = c; bestS = sc;
    }
  }
  return best;
}
function scrub(text) {
  let t = text;
  // Normalizaciones puntuales
  t = t.replace(/Cl[\u2022\u00b7]{2}nico/g, 'Clínico')
       .replace(/Revisi[\u2022\u00b7]{2}n Sistem[Çç][\u00adt]?tica/g, 'Revisión Sistemática')
       .replace(/Meta-an[\u00c3\u0083\u008a\u00c2\u00adlisis|Ã‡Â­lisis]/g, 'Meta-análisis');
  // Residuos comunes
  // eslint-disable-next-line no-control-regex
  t = t.replace(/\u0000|\u001a|\u0015/g, '')
       .replace(/[\uFFFD]/g, '')
       .replace(/Ã‚/g, '')
       .replace(/Ã€/g, 'À')
       .replace(/Ã©/g, 'é').replace(/Ãª/g, 'ê').replace(/Ã¨/g, 'è')
       .replace(/Ã¡/g, 'á').replace(/Ã¢/g, 'â').replace(/Ã±/g, 'ñ')
       .replace(/Ã³/g, 'ó').replace(/Ãº/g, 'ú').replace(/Ã­/g, 'í')
       .replace(/Ã“/g, 'Ó').replace(/Ãš/g, 'Ú').replace(/Ã/g, 'Á').replace(/Ã‘/g, 'Ñ')
       .replace(/â€¢/g, '•').replace(/â€“/g, '–').replace(/â€”/g, '—')
       .replace(/â€¦/g, '…').replace(/â€œ/g, '“').replace(/â€/g, '”')
       .replace(/â€˜/g, '‘').replace(/â€™/g, '’')
       .replace(/â†’/g, '→').replace(/â†/g, '←').replace(/âœ“/g, '✓');
  return t;
}

for (const rel of targets) {
  const file = path.resolve(process.cwd(), rel);
  if (!fs.existsSync(file)) continue;
  const orig = fs.readFileSync(file, 'utf8');
  const rep = bestRepair(orig);
  const cleaned = scrub(rep);
  let final = cleaned;
  if (rel.includes('data/products/loader.ts')) {
    // Eliminación agresiva de residuos en loader donde comentarios/strings heredados tienen mojibake complejo
    final = final.replace(/[ÃÂ]/g, '');
    // Remover residuos en comentarios combinados
    final = final.replace(/[âƒ†]/g, (ch) => (ch === 'â' ? '' : ''));
    // Reescribir los dos primeros bloques de comentario con versión limpia
    const cleanHeader = `/**\n * Módulo: loader de productos (dinámico)\n * Propósito:\n *  - Cargar el catálogo completo desde all-products.ts solo cuando sea necesario,\n *    reduciendo el tamaño del bundle inicial.\n *  - Ofrecer utilidades de caché simples por categoría e ID.\n * Funciones:\n *  - loadProductsByCategory: Devuelve productos filtrados por categoría (o todos)\n *  - loadProductById: Busca un producto puntual (apoyándose en la caché por categoría "todos")\n *  - preloadCategories: Pre-carga categorías en paralelo\n *  - clearProductCache / getCacheStats: Mantenimiento y métricas del caché\n */`;
    const cleanSecond = `/**\n * Sistema de carga dinámica de productos con caché inteligente\n * Optimiza el bundle inicial cargando productos solo cuando se necesitan\n */`;
    // reemplazar primer bloque
    final = final.replace(/\/\*[\s\S]*?\*\//, cleanHeader);
    // reemplazar segundo bloque
    final = final.replace(/\/\*[\s\S]*?\*\//, cleanSecond);
    // Arreglos puntuales en líneas problemáticas
    final = final.replace(/Erythrocyte Membrane Fluidity([^\n]*)/g, (m)=> m.replace(/[^A-Za-z0-9:,.\-\s]/g,'') + '…')
                 .replace(/study of safety and efficacy([^\n]*)/g, (m)=> m.replace(/[^A-Za-z0-9:,.\-\s]/g,'') + '…')
                 .replace(/\u2013|â€“/g, '–');
  }
  if (final !== orig) {
    fs.writeFileSync(file, final, 'utf8');
    console.log('Cleaned:', rel);
  } else {
    console.log('No changes:', rel);
  }
}
console.log('Specific files cleanup completed.');
