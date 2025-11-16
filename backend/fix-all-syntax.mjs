import { readFileSync, writeFileSync } from 'fs';

console.log('🔧 Reparando products-data.ts...\n');

const filePath = './src/db/products-data.ts';
const lines = readFileSync(filePath, 'utf-8').split('\n');

let fixed = 0;
const result = [];

for (let i = 0; i < lines.length; i++) {
  const current = lines[i];
  const next = lines[i + 1];
  
  // Patrón 1: Después de '],', siguiente línea es '      {' (6 espacios + '{')
  if (current.trim() === '],' && next && /^\s{6}\{/.test(next)) {
    const indent = current.match(/^(\s*)/)[1];
    result.push(current);
    result.push(`${indent}scientificReferences: [`);
    fixed++;
    continue;
  }
  
  // Patrón 2: Después de línea que termina con ',', siguiente línea es '      {' (6 espacios + '{')
  // y la línea actual contiene 'tags:', 'sku:', 'stock:', etc. (propiedades finales antes de scientificReferences)
  if (current.trim().endsWith(',') && 
      (current.includes('tags:') || current.includes('priceNote:') || current.includes('administrationMethod:')) &&
      next && /^\s{6}\{/.test(next)) {
    const indent = current.match(/^(\s*)/)[1];
    result.push(current);
    result.push(`${indent}scientificReferences: [`);
    fixed++;
    continue;
  }
  
  result.push(current);
}

writeFileSync(filePath, result.join('\n'), 'utf-8');

console.log(`✅ Reparados ${fixed} problemas de sintaxis`);
console.log('✅ Archivo listo para compilar\n');
