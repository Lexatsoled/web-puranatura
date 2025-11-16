import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo de productos
const productsFile = path.join(__dirname, '..', 'data', 'products.ts');
let content = fs.readFileSync(productsFile, 'utf8');

// Lista de todas las URLs de Piping Rock que necesitan ser reemplazadas
const allPipingRockReplacements = [
  // Bamboo Extract
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14158_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14158_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14158_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=bamboo-extract',
        full: 'https://picsum.photos/600/600?random=bamboo-extract',
      },
    ],`,
  },
  // Borage Oil
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14154_2.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14154_2.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14154_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=borage-oil',
        full: 'https://picsum.photos/600/600?random=borage-oil',
      },
    ],`,
  },
  // Liver Cleanse
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/6/16486_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/6/16486_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/6/16486_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=liver-cleanse',
        full: 'https://picsum.photos/600/600?random=liver-cleanse',
      },
    ],`,
  },
  // Ashwagandha Melatonin
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/7/17265_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/7/17265_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17265_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=ashwa-melatonin',
        full: 'https://picsum.photos/600/600?random=ashwa-melatonin',
      },
    ],`,
  },
  // Basil Oil
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14001_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14001_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14001_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=basil-oil',
        full: 'https://picsum.photos/600/600?random=basil-oil',
      },
    ],`,
  },
  // Creatine
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14520_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14520_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14520_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=creatine',
        full: 'https://picsum.photos/600/600?random=creatine',
      },
    ],`,
  },
  // Chamomile Oil
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14008_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14008_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14008_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=chamomile-oil',
        full: 'https://picsum.photos/600/600?random=chamomile-oil',
      },
    ],`,
  },
  // Sandalwood Oil
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14045_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14045_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14045_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=sandalwood-oil',
        full: 'https://picsum.photos/600/600?random=sandalwood-oil',
      },
    ],`,
  },
  // GABA
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14456_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14456_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14456_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=gaba',
        full: 'https://picsum.photos/600/600?random=gaba',
      },
    ],`,
  },
  // 5-HTP
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14401_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14401_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14401_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=5htp',
        full: 'https://picsum.photos/600/600?random=5htp',
      },
    ],`,
  },
  // Turmeric Complex
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14287_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14287_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14287_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=turmeric',
        full: 'https://picsum.photos/600/600?random=turmeric',
      },
    ],`,
  },
  // CoQ10
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14198_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14198_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14198_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=coq10',
        full: 'https://picsum.photos/600/600?random=coq10',
      },
    ],`,
  },
  // Bacopa
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14203_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14203_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14203_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=bacopa',
        full: 'https://picsum.photos/600/600?random=bacopa',
      },
    ],`,
  },
  // PQQ
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14589_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14589_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14589_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=pqq',
        full: 'https://picsum.photos/600/600?random=pqq',
      },
    ],`,
  },
  // Garlic (Ajo)
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14156_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14156_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14156_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=garlic',
        full: 'https://picsum.photos/600/600?random=garlic',
      },
    ],`,
  },
  // Kudzu Root
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14348_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14348_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14348_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=kudzu',
        full: 'https://picsum.photos/600/600?random=kudzu',
      },
    ],`,
  },
  // Arnica Oil
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14003_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14003_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14003_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=arnica-oil',
        full: 'https://picsum.photos/600/600?random=arnica-oil',
      },
    ],`,
  },
  // Apple Cider Vinegar
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14089_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14089_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14089_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=apple-cider-vinegar',
        full: 'https://picsum.photos/600/600?random=apple-cider-vinegar',
      },
    ],`,
  },
  // Activated Charcoal
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14126_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14126_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14126_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=activated-charcoal',
        full: 'https://picsum.photos/600/600?random=activated-charcoal',
      },
    ],`,
  },
  // Ashwagandha 240
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14230_2.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14230_2.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14230_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=ashwagandha-240',
        full: 'https://picsum.photos/600/600?random=ashwagandha-240',
      },
    ],`,
  },
  // Soy Lecithin
  {
    original: `images: [
      {
        thumbnail: 'https://www.pipingrock.com/media/catalog/product/1/4/14476_1.jpg',
        full: 'https://www.pipingrock.com/media/catalog/product/1/4/14476_1.jpg',
      },
    ],`,
    replacement: `// IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14476_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=soy-lecithin',
        full: 'https://picsum.photos/600/600?random=soy-lecithin',
      },
    ],`,
  },
];

// Aplicar todos los reemplazos
let updatedContent = content;
let changesCount = 0;

allPipingRockReplacements.forEach((replacement, index) => {
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

console.log(`\n🎉 Proceso completado:`);
console.log(`- ${changesCount} reemplazos aplicados`);
console.log(
  `- ${allPipingRockReplacements.length - changesCount} reemplazos ya existían o no se encontraron`
);
console.log(`\n📝 Todos los productos de Piping Rock ahora tienen:`);
console.log(`   • Imágenes placeholder funcionales`);
console.log(`   • Comentarios con las URLs originales de Piping Rock`);
