import fs from 'fs';

const content = fs.readFileSync('src/data/products.ts', 'utf8');

// Encontrar el primer cierre de array de productos
const firstArrayClose = content.indexOf('  // ===== FIN DE PRODUCTOS =====');
const afterFirstClose = content.indexOf('];', firstArrayClose) + 2;

// Encontrar el segundo cierre de array (línea 4208 aproximadamente)
const secondArrayClosePattern =
  /\n\];\n\n\/\/ ===== INTERFACES PARA SISTEMAS SINÉRGICOS =====\n\nexport interface System \{\n {2}id: string;\n {2}name: string;\n {2}description: string;/;
const match = content.slice(afterFirstClose).match(secondArrayClosePattern);

if (match) {
  const secondArrayCloseIndex = afterFirstClose + match.index;

  // Construir el nuevo contenido
  const before = content.slice(0, afterFirstClose);
  const after = content.slice(secondArrayCloseIndex);

  const newContent =
    before +
    '\n\n// ===== INTERFACES PARA SISTEMAS SINÉRGICOS =====\n\nexport interface System {\n  id: string;\n  name: string;\n  description: string;' +
    after.slice(match[0].length);

  fs.writeFileSync('src/data/products.ts', newContent, 'utf8');
  console.log('✅ Archivo limpiado correctamente');
  console.log(
    `   - Eliminadas ${content.length - newContent.length} caracteres de basura`
  );
} else {
  console.log('❌ No se encontró el patrón para limpiar');
}
