import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo de productos
const productsFile = path.join(__dirname, '..', 'data', 'products.ts');
let content = fs.readFileSync(productsFile, 'utf8');

// Lista de reemplazos para productos de Piping Rock
const replacements = [
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14242_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14242_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14242_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=konjac-fiber',
        full: 'https://picsum.photos/600/600?random=konjac-fiber',
      },
    ],`,
  },
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/1/11907_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/1/11907_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/1/11907_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=tribulus',
        full: 'https://picsum.photos/600/600?random=tribulus',
      },
    ],`,
  },
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14098_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14098_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14098_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=inositol',
        full: 'https://picsum.photos/600/600?random=inositol',
      },
    ],`,
  },
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/7/17486_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/7/17486_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17486_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=magnesium-threonate',
        full: 'https://picsum.photos/600/600?random=magnesium-threonate',
      },
    ],`,
  },
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14633_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14633_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14633_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=fish-oil',
        full: 'https://picsum.photos/600/600?random=fish-oil',
      },
    ],`,
  },
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14404_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14404_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14404_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=maca',
        full: 'https://picsum.photos/600/600?random=maca',
      },
    ],`,
  },
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14230_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14230_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14230_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=ashwagandha',
        full: 'https://picsum.photos/600/600?random=ashwagandha',
      },
    ],`,
  },
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14509_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14509_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14509_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=same',
        full: 'https://picsum.photos/600/600?random=same',
      },
    ],`,
  },
];

// Aplicar los reemplazos
let updatedContent = content;
let changesCount = 0;

replacements.forEach((replacement, index) => {
  if (updatedContent.includes(replacement.original)) {
    updatedContent = updatedContent.replace(
      replacement.original,
      replacement.replacement
    );
    changesCount++;
    console.log(`✅ Reemplazo ${index + 1} aplicado`);
  } else {
    console.log(`⚠️ Reemplazo ${index + 1} no encontrado`);
  }
});

// Guardar el archivo actualizado
fs.writeFileSync(productsFile, updatedContent, 'utf8');

console.log(`\n🎉 Proceso completado:`);
console.log(`- ${changesCount} reemplazos aplicados`);
console.log(
  `- ${replacements.length - changesCount} reemplazos ya existían o no se encontraron`
);
console.log(`\n📝 Ahora todos los productos de Piping Rock tienen:`);
console.log(`   • Imágenes placeholder funcionales`);
console.log(`   • Comentarios con las URLs originales de Piping Rock`);
