import { readFileSync, writeFileSync } from 'fs';

console.log('🔧 Corrigiendo errores de sintaxis en products-data.ts...\n');

const filePath = './src/db/products-data.ts';
let content = readFileSync(filePath, 'utf-8');

// Patrón: encontrar '    ],\n      {' (cierre de array FAQs seguido de objeto scientificReferences sin declarar)
// Debe convertirse en '    ],\n    scientificReferences: [\n      {'
const pattern = /(    )\],\n(      )\{/g;

let count = 0;
content = content.replace(pattern, (match, indent1, indent2) => {
  count++;
  return `${indent1}],\n${indent1}scientificReferences: [\n${indent2}{`;
});

writeFileSync(filePath, content, 'utf-8');

console.log(`✅ Corregidos ${count} errores de sintaxis`);
console.log('✅ Archivo products-data.ts reparado\n');
