import fs from 'fs';

const lines = fs.readFileSync('src/data/products.ts', 'utf8').split('\n');

// Encontrar la línea con "// ===== FIN DE PRODUCTOS ====="
const endProductsIndex = lines.findIndex((line) =>
  line.includes('// ===== FIN DE PRODUCTOS =====')
);

// Encontrar el primer ]; después de esa línea
let firstArrayCloseIndex = -1;
for (let i = endProductsIndex; i < lines.length; i++) {
  if (lines[i].trim() === '];') {
    firstArrayCloseIndex = i;
    break;
  }
}

// Encontrar la siguiente línea con "export interface System {" que tiene también "description:"
let correctInterfaceIndex = -1;
for (let i = firstArrayCloseIndex + 1; i < lines.length; i++) {
  if (lines[i].includes('export interface System {')) {
    // Verificar si las siguientes líneas tienen la estructura correcta
    if (
      lines[i + 1] &&
      lines[i + 1].includes('id: string;') &&
      lines[i + 2] &&
      lines[i + 2].includes('name: string;') &&
      lines[i + 3] &&
      lines[i + 3].includes('description: string;')
    ) {
      correctInterfaceIndex = i;
      break;
    }
  }
}

if (firstArrayCloseIndex > 0 && correctInterfaceIndex > 0) {
  console.log(`Primera cierre de array: línea ${firstArrayCloseIndex + 1}`);
  console.log(`Interfaz correcta: línea ${correctInterfaceIndex + 1}`);
  console.log(
    `Líneas a eliminar: ${correctInterfaceIndex - firstArrayCloseIndex - 1}`
  );

  // Construir nuevo contenido eliminando las líneas basura
  const cleanLines = [
    ...lines.slice(0, firstArrayCloseIndex + 1),
    '',
    '// ===== INTERFACES PARA SISTEMAS SINÉRGICOS =====',
    '',
    ...lines.slice(correctInterfaceIndex),
  ];

  fs.writeFileSync('src/data/products.ts', cleanLines.join('\n'), 'utf8');
  console.log('✅ Archivo limpiado correctamente');
  console.log(`   - Total de líneas antes: ${lines.length}`);
  console.log(`   - Total de líneas después: ${cleanLines.length}`);
} else {
  console.log(`❌ No se encontraron los índices correctos`);
  console.log(`   - First array close: ${firstArrayCloseIndex}`);
  console.log(`   - Correct interface: ${correctInterfaceIndex}`);
}
