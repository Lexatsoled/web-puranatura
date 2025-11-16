#!/usr/bin/env node

/**
 * Script de validación de comentarios en español
 * Verifica que los comentarios JSDoc estén en español y cumplan con estándares
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Configuración
const __dirname = path.dirname(
  new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
);
const SRC_DIR = path.join(__dirname, '..', 'src');
const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const SPANISH_KEYWORDS = [
  'función',
  'clase',
  'interfaz',
  'tipo',
  'parámetro',
  'retorna',
  'devuelve',
  'descripción',
  'ejemplo',
  'ver',
  'desde',
  'hasta',
  'entre',
  'con',
  'sin',
  'para',
  'por',
  'como',
  'que',
  'este',
  'esta',
  'estos',
  'estas',
  'del',
  'de la',
  'de los',
  'de las',
  'un',
  'una',
  'unos',
  'unas',
  'el',
  'la',
  'los',
  'las',
  'y',
  'o',
  'pero',
  'aunque',
  'si',
  'no',
  'sí',
  'muy',
  'más',
  'menos',
  'igual',
  'diferente',
  'mayor',
  'menor',
  'verdadero',
  'falso',
  'nulo',
  'indefinido',
  'objeto',
  'array',
  'lista',
  'elemento',
  'componente',
  'servicio',
  'utilidad',
  'hook',
  'estado',
  'propiedad',
  'método',
  'constructor',
  'destructor',
  'evento',
  'acción',
  'resultado',
  'error',
  'excepción',
  'manejo',
  'validación',
  'autenticación',
  'autorización',
];

let errors = [];
let warnings = [];

// Función para detectar si un texto está en español
function isSpanish(text) {
  if (!text || typeof text !== 'string') return false;

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  // Contar palabras en español
  let spanishWords = 0;
  let totalWords = 0;

  words.forEach((word) => {
    // Limpiar puntuación
    const cleanWord = word.replace(/[.,!?;:()[\]{}"']/g, '');
    if (cleanWord.length > 0) {
      totalWords++;
      if (SPANISH_KEYWORDS.some((keyword) => cleanWord.includes(keyword))) {
        spanishWords++;
      }
    }
  });

  // Si más del 30% de las palabras están en español, consideramos que está en español
  return totalWords > 0 && spanishWords / totalWords > 0.3;
}

// Función para validar comentario JSDoc
function validateJSDocComment(filePath, content, lineNumber) {
  const lines = content.split('\n');
  const commentLines = [];

  // Extraer líneas del comentario
  for (let i = lineNumber; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith('/**') ||
      line.startsWith('*') ||
      line.startsWith('*/')
    ) {
      commentLines.push(line);
      if (line.endsWith('*/')) break;
    } else {
      break;
    }
  }

  const commentText = commentLines
    .join(' ')
    .replace(/\s*\*\s*/g, ' ')
    .replace(/^\/\*\*\s*/, '')
    .replace(/\s*\*\/\s*$/, '')
    .trim();

  if (!commentText) {
    warnings.push(`${filePath}:${lineNumber + 1} - Comentario JSDoc vacío`);
    return;
  }

  if (!isSpanish(commentText)) {
    errors.push(
      `${filePath}:${lineNumber + 1} - Comentario JSDoc debe estar en español: "${commentText.substring(0, 50)}..."`
    );
  }

  // Validar etiquetas JSDoc comunes
  // const hasParam = /@param\s/.test(commentText);
  // const hasReturns = /@returns?\s|@return\s/.test(commentText);
  const hasDescription = commentText.length > 10;

  if (!hasDescription) {
    warnings.push(
      `${filePath}:${lineNumber + 1} - Comentario JSDoc muy corto, agregar descripción`
    );
  }
}

// Función para procesar archivo
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Buscar comentarios JSDoc
      if (line.trim().startsWith('/**')) {
        validateJSDocComment(filePath, content, index);
      }

      // Buscar comentarios de línea que podrían necesitar documentación
      if (
        (line.trim().startsWith('//') && line.includes('TODO')) ||
        line.includes('FIXME')
      ) {
        warnings.push(
          `${filePath}:${index + 1} - TODO/FIXME encontrado: ${line.trim()}`
        );
      }
    });
  } catch (error) {
    errors.push(`Error procesando ${filePath}: ${error.message}`);
  }
}

// Función principal
async function main() {
  console.log('🔍 Validando comentarios en español...\n');

  try {
    // Encontrar todos los archivos fuente
    const files = await glob(`${SRC_DIR}/**/*`, {
      ignore: [
        '**/*.test.*',
        '**/*.spec.*',
        '**/__tests__/**',
        '**/node_modules/**',
      ],
    });

    const sourceFiles = files.filter((file) =>
      ALLOWED_EXTENSIONS.includes(path.extname(file))
    );

    console.log(`📁 Procesando ${sourceFiles.length} archivos...\n`);

    // Procesar cada archivo
    sourceFiles.forEach(processFile);

    // Mostrar resultados
    if (errors.length > 0) {
      console.log('❌ Errores encontrados:');
      errors.forEach((error) => console.log(`  ${error}`));
      console.log('');
    }

    if (warnings.length > 0) {
      console.log('⚠️  Advertencias:');
      warnings.forEach((warning) => console.log(`  ${warning}`));
      console.log('');
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ Todos los comentarios están correctos');
    } else {
      console.log(
        `📊 Resumen: ${errors.length} errores, ${warnings.length} advertencias`
      );
      if (errors.length > 0) {
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Error ejecutando validación:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateJSDocComment, isSpanish };
