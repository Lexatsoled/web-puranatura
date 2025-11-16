import fs from 'fs';
// import path from 'path'; // Not used in this script
import * as glob from 'glob';

// Mapeo completo de caracteres corruptos
const mojibakeMap = {
  // Tildes y acentos
  // 'Ã³': 'ó',
  // 'Ã­': 'í',
  // 'Ã©': 'é',
  // 'Ã¡': 'á',
  // Ãº: 'ú',
  // 'Ã': 'Ó',
  // 'Ã': 'Í',
  // 'Ã‰': 'É',
  // 'Ã': 'Á',
  // Ãš: 'Ú',
  // 'Ã±': 'ñ',
  // 'Ã': 'Ñ',

  // Caracteres especiales complejos
  "ÃƒÆ'Ã†â€™Ãƒâ€šÃ‚Â³": 'ó',
  "ÃƒÆ'Ã†â€™Ãƒâ€šÃ‚Â­": 'í',
  "ÃƒÆ'Ã†â€™Ãƒâ€šÃ‚Â©": 'é',
  "ÃƒÆ'Ã†â€™Ãƒâ€šÃ‚Â¡": 'á',
  "ÃƒÆ'Ã†â€™Ãƒâ€šÃ‚Âº": 'ú',
  "ÃƒÆ'Ã†â€™Ãƒâ€šÃ‚Â±": 'ñ',

  // Nuevos patrones complejos
  'cÃƒÆ’Ã‚Â­': 'cí',
  'ÃƒÆ’Ã‚Â¡': 'á',
  'ÃƒÆ’Ã‚Â³': 'ó',
  'ÃƒÆ’Ã‚Â±': 'ñ',
  'ÃƒÆ’Ã‚Â©': 'é',
  'ÃƒÆ’Ã‚Âº': 'ú',
  'ÃƒÆ’Ã‚Â­': 'í',

  // Símbolos
  'â€™': "'",
  'â€œ': '"',
  'â€': '"',
  'â€': '—',
  'â€': '–',
  'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“': '–',

  // Signos de interrogación y exclamación
  'Âȇ€šÂ¿': '¿',
  'Âȇ€šÂ¡': '¡',
  'Ãƒâ€šÃ‚Â¿': '¿', // Added this new pattern

  // Otros patrones comunes
  'ÃƒÂ©': 'é',
  'ÃƒÂ³': 'ó',
  'ÃƒÂ­': 'í',
  'ÃƒÂ¡': 'á',
  ÃƒÂº: 'ú',
  'ÃƒÂ±': 'ñ',
  'Ãƒâ€šÃ‚Â·': '·', // Added this new pattern

  // Emojis corruptos
  'ðŸ›': '🛒',
  'ðŸ"': '🔒',
  'ðŸŒ¿': '🌿',
  'âœ¨': '✨',
  'ðŸš€': '🚀',
};

// Archivos a procesar
const patterns = ['src/**/*.{ts,tsx,js,jsx}', '*.md', 'README.md'];

let totalFixed = 0;
let filesFixed = 0;

patterns.forEach((pattern) => {
  glob.sync(pattern, { ignore: 'node_modules/**' }).forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    let fixedInFile = 0;

    // Aplicar cada reemplazo
    Object.entries(mojibakeMap).forEach(([bad, good]) => {
      const regex = new RegExp(bad.replace(/[.*+?^${}()|[\\]/g, '\\$&'), 'g');
      const matches = (content.match(regex) || []).length;
      if (matches > 0) {
        content = content.replace(regex, good);
        fixedInFile += matches;
        totalFixed += matches;
      }
    });

    // Guardar si hubo cambios
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      filesFixed++;
      console.log(`✓ Corregido ${file} (${fixedInFile} instancias)`);
    }
  });
});

console.log(`\n✅ COMPLETADO:`);
console.log(`   Archivos corregidos: ${filesFixed}`);
console.log(`   Instancias mojibake: ${totalFixed}`);
