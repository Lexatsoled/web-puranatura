import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo de productos
const productsFile = path.join(__dirname, '..', 'data', 'products.ts');
let content = fs.readFileSync(productsFile, 'utf8');

// Últimos productos de Piping Rock que faltan por actualizar
const finalReplacements = [
  // Clove Oil
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14012_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14012_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14012_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=clove-oil',
        full: 'https://picsum.photos/600/600?random=clove-oil',
      },
    ],`,
  },
  // Cranberry Vitamin C
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14189_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14189_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14189_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=cranberry-vitamin-c',
        full: 'https://picsum.photos/600/600?random=cranberry-vitamin-c',
      },
    ],`,
  },
  // Collagen Peptides
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/7/17234_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/7/17234_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17234_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=collagen-peptides',
        full: 'https://picsum.photos/600/600?random=collagen-peptides',
      },
    ],`,
  },
  // Digestive Duo
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/6/16789_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/6/16789_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/6/16789_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=digestive-duo',
        full: 'https://picsum.photos/600/600?random=digestive-duo',
      },
    ],`,
  },
  // Liver Cleanse 3-Day (variant)
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/6/16486_2.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/6/16486_2.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/6/16486_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=liver-cleanse-3day',
        full: 'https://picsum.photos/600/600?random=liver-cleanse-3day',
      },
    ],`,
  },
  // Chamomile Oil 6-pack
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14008_2.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14008_2.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14008_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=chamomile-6pack',
        full: 'https://picsum.photos/600/600?random=chamomile-6pack',
      },
    ],`,
  },
  // Sandalwood Oil 6-pack
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14045_2.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14045_2.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14045_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=sandalwood-6pack',
        full: 'https://picsum.photos/600/600?random=sandalwood-6pack',
      },
    ],`,
  },
  // Ashwagandha Melatonin 4-pack
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/7/17265_2.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/7/17265_2.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17265_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=ashwa-melatonin-4pack',
        full: 'https://picsum.photos/600/600?random=ashwa-melatonin-4pack',
      },
    ],`,
  },
  // GABA Single
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14456_2.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14456_2.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14456_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=gaba-single',
        full: 'https://picsum.photos/600/600?random=gaba-single',
      },
    ],`,
  },
  // MCT Oil
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/7/17489_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/7/17489_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17489_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=mct-oil',
        full: 'https://picsum.photos/600/600?random=mct-oil',
      },
    ],`,
  },
];

// Aplicar los reemplazos finales
let updatedContent = content;
let changesCount = 0;

finalReplacements.forEach((replacement, index) => {
  if (updatedContent.includes(replacement.original)) {
    updatedContent = updatedContent.replace(
      replacement.original,
      replacement.replacement
    );
    changesCount++;
    console.log(`✅ Reemplazo ${index + 1} aplicado`);
  } else {
    console.log(`⚠️ Reemplazo ${index + 1} no encontrado o ya procesado`);
  }
});

// Guardar el archivo actualizado
fs.writeFileSync(productsFile, updatedContent, 'utf8');

console.log(`\n🎉 PROCESO FINAL COMPLETADO:`);
console.log(`- ${changesCount} reemplazos aplicados en esta última ronda`);
console.log(
  `- ${finalReplacements.length - changesCount} reemplazos ya existían o no se encontraron`
);

// Verificar que no queden URLs de Piping Rock
const finalContent = fs.readFileSync(productsFile, 'utf8');
const remainingPipingRockUrls = (
  finalContent.match(/thumbnail: 'https:\/\/www\.pipingrock\.com/g) || []
).length;

console.log(`\n📊 VERIFICACIÓN FINAL:`);
if (remainingPipingRockUrls === 0) {
  console.log(
    `✅ ¡PERFECTO! No quedan URLs directas de Piping Rock en el archivo`
  );
  console.log(`✅ Todos los productos ahora tienen:`);
  console.log(`   • Imágenes placeholder funcionales`);
  console.log(`   • Comentarios con las URLs originales para búsqueda manual`);
} else {
  console.log(
    `⚠️ Aún quedan ${remainingPipingRockUrls} URLs de Piping Rock por procesar`
  );
}
