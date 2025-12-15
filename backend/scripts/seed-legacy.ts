import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Create a standalone Prisma instance for the seed script
dotenv.config(); // Load .env file from /backend/.env

// Ensure DATABASE_URL is set correctly for SQLite file path if relative
let dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
  dbUrl = `file:${dbPath}`;
  console.log('Using default DATABASE_URL:', dbUrl);
} else if (dbUrl.startsWith('file:')) {
  const dbPath = dbUrl.replace('file:', '');
  if (!path.isAbsolute(dbPath)) {
    // Resolve relative to backend root (assuming we run from backend root)
    dbUrl = `file:${path.resolve(process.cwd(), dbPath)}`;
    console.log('Resolved DATABASE_URL:', dbUrl);
  }
}

console.log('Final Connection String:', dbUrl);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

// 1. Image Resolution Logic
// Paths relative to 'backend' directory (process.cwd())
const manifestPath = path.resolve(
  process.cwd(),
  '../src/data/image-manifest.json'
);
let manifestMap = new Map();

if (fs.existsSync(manifestPath)) {
  console.log('Loading manifest from:', manifestPath);
  try {
    let content = fs.readFileSync(manifestPath, 'utf-8');
    if (content.charCodeAt(0) === 0xfeff) content = content.slice(1);
    const manifestEntries = JSON.parse(content);
    manifestMap = new Map(
      manifestEntries.map((entry: any) => [entry.slug, entry])
    );
    console.log(`Loaded ${manifestMap.size} manifest entries.`);
  } catch (e) {
    console.warn('Failed to parse manifest:', e);
  }
} else {
  console.warn('Manifest not found at:', manifestPath);
}

// Map of lower-cased webp filenames in optimized folder
const optimizedDir = path.resolve(process.cwd(), '../public/optimized');
const optimizedImagesMap = new Map<string, string>();
if (fs.existsSync(optimizedDir)) {
  try {
    const files = fs.readdirSync(optimizedDir);
    for (const file of files) {
      if (file.toLowerCase().endsWith('.webp')) {
        // Store "inositol anverso.webp" -> "Inositol Anverso.webp"
        optimizedImagesMap.set(file.toLowerCase(), file);
      }
    }
    console.log(
      `Loaded ${optimizedImagesMap.size} optimized images from ${optimizedDir}`
    );
  } catch (e) {
    console.warn('Failed to scan optimized directory:', e);
  }
} else {
  console.warn('Optimized directory not found:', optimizedDir);
}

const FALLBACK_IMAGE = '/Jpeg/vitamina_c_1000_500x500.jpg';

const imageAliasMap: Record<string, string> = {
  'c-1000-with-bioflavonoids-anverso': 'vitamina-c-now-anverso',
  'c-1000-with-bioflavonoids-reverso': 'vitamina-c-1000-500x500',
  'high-potency-vitamin-d3-10-000-iu-anverso': 'vitamina-d3-10000-anverso',
  'high-potency-vitamin-d3-10-000-iu-reverso': 'vitamina-d3-10000-500x500',
  'calcium-magnesium-zinc-anverso': 'calcio-magnesio-anverso',
  'calcium-magnesium-zinc-reverso': 'calcio-magnesio-etiqueta-500x500',
  'glucosamine-chondroitin-anverso': 'glucosamina-condroitina-anverso',
  'glucosamine-chondroitin-reverso': 'glucosamina-condroitina-500x500',
  'immune-probiotic-go-pack-anverso': 'ultimate-flora-500x500',
  'immune-probiotic-go-pack-reverso': 'ultimate-flora-500x500',
};

const normalizeImageKey = (value: string) =>
  value
    .replace(/^\/?Jpeg\//i, '')
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const resolveImagePath = (value: string): string => {
  if (!value) return FALLBACK_IMAGE;

  // STRICT REJECTION of external/placeholder URLs
  if (
    value.includes('http') ||
    value.includes('picsum') ||
    value.includes('unsplash')
  ) {
    return FALLBACK_IMAGE;
  }

  // 1. Check optimized folder for direct match (changing ext to .webp)
  const cleanName = path.basename(value, path.extname(value));
  const webpName = `${cleanName}.webp`.toLowerCase();

  if (optimizedImagesMap.has(webpName)) {
    // Return absolute path starting with /
    return `/optimized/${optimizedImagesMap.get(webpName)}`;
  }

  // 2. Try Alias / Manifest logic
  const baseName = value.replace(/^\/?Jpeg\//i, '');
  const normalizedKey = normalizeImageKey(baseName);
  const slug = imageAliasMap[normalizedKey] ?? normalizedKey;

  const manifestEntry = manifestMap.get(slug);
  if (manifestEntry?.path) {
    return manifestEntry.path.startsWith('/')
      ? manifestEntry.path
      : `/${manifestEntry.path}`;
  }

  // 3. Fallback to original path ONLY if it looks like a local asset (starts with /Jpeg or /optimized)
  // Otherwise use generic fallback
  if (
    value.toLowerCase().includes('jpeg') ||
    value.toLowerCase().includes('optimized')
  ) {
    return value.startsWith('/') ? value : `/${value}`;
  }

  return FALLBACK_IMAGE;
};

// 2. Extract Data
const productsFilePath = path.resolve(process.cwd(), '../src/data/products.ts');

function extractLegacyProducts() {
  console.log('Reading products from:', productsFilePath);
  const fileContent = fs.readFileSync(productsFilePath, 'utf-8');

  // Relaxed regex to capture the array content.
  // Matches "const legacyProducts: Product[] =" (allowing spaces)
  // Captures the array [...]
  // Ends at "export const products"
  const regex =
    /const legacyProducts\s*:\s*Product\[\]\s*=\s*(\[[\s\S]*?\]);\s*(?:\/\/.*|\n)*\s*export/m;
  const match = fileContent.match(regex);

  if (!match || !match[1]) {
    // Fallback regex in case 'export' is far away or missing
    // Look for just the start and try to balance brackets? No, simple regex first.
    // Try matching just the start line and grabbing "everything" until the last ]; ?
    // Let's debug by printing a snippet if fail
    const snippet = fileContent.substring(0, 500); // Check file header
    // console.log('File snippet:', snippet);
    throw new Error('Could not extract legacyProducts array (regex mismatch)');
  }
  return eval(match[1]);
}

const sanitize = (text: string) => text?.trim().replace(/\s+/g, ' ') || '';

async function main() {
  console.log('🌱 Starting COMPLETE database seed...');

  let productsToSeed: any[] = [];
  try {
    productsToSeed = extractLegacyProducts();
    console.log(`Found ${productsToSeed.length} products to seed.`);
  } catch (e) {
    console.error('Failed to extract products:', e);
    process.exit(1);
  }

  // Cleanup
  console.log('Cleaning existing data...');
  try {
    await prisma.orderItem.deleteMany({});
  } catch (e) {}
  try {
    await prisma.review.deleteMany({});
  } catch (e) {}
  try {
    await prisma.product.deleteMany({});
  } catch (e) {}

  let successCount = 0;
  for (const product of productsToSeed) {
    // Determine Image URL
    let finalImageUrl = FALLBACK_IMAGE;
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      // 1. Try to find an 'Anverso' image first
      let bestImage = product.images.find(
        (img: any) =>
          (img.full && img.full.toLowerCase().includes('anverso')) ||
          (img.thumbnail && img.thumbnail.toLowerCase().includes('anverso'))
      );

      // 2. If no Anverso, fallback to the first image
      if (!bestImage) {
        bestImage = product.images[0];
      }

      const src = bestImage.full || bestImage.thumbnail;
      finalImageUrl = resolveImagePath(src);
    }

    // Debugging logic for ID 101
    if (product.id === '101') {
      console.log('--- DEBUG ID 101 ---');
      console.log('Images:', JSON.stringify(product.images));

      // Check logic 1: Best Image
      const debugBestImage = product.images.find(
        (img: any) =>
          (img.full && img.full.toLowerCase().includes('anverso')) ||
          (img.thumbnail && img.thumbnail.toLowerCase().includes('anverso'))
      );
      console.log('Selected Anverso Image:', debugBestImage);

      // Check logic 2: Resolve Path
      const src = debugBestImage
        ? debugBestImage.full || debugBestImage.thumbnail
        : 'NONE';
      console.log('Resolving path for:', src);

      // Check map manually
      const cleanName = path.basename(src, path.extname(src));
      const webpName = `${cleanName}.webp`.toLowerCase();
      console.log('Computed webpName:', webpName);
      console.log('Map has it?', optimizedImagesMap.has(webpName));
      if (optimizedImagesMap.has(webpName)) {
        console.log('Map value:', optimizedImagesMap.get(webpName));
      }
    }

    // --- FIX: Sort images array to prioritize 'Anverso' ---
    // This ensures that the frontend (which defaults to index 0) shows the front of the product.
    if (product.images && Array.isArray(product.images)) {
      // @ts-ignore
      product.images.sort((a, b) => {
        const aStr = (a.full || a.thumbnail || '').toLowerCase();
        const bStr = (b.full || b.thumbnail || '').toLowerCase();
        const aIsAnverso = aStr.includes('anverso');
        const bIsAnverso = bStr.includes('anverso');

        if (aIsAnverso && !bIsAnverso) return -1; // a comes first
        if (!aIsAnverso && bIsAnverso) return 1; // b comes first
        return 0; // maintain relative order
      });
    }
    // -----------------------------------------------------

    try {
      await prisma.product.create({
        data: {
          id: product.id,
          name: sanitize(product.name),
          slug: product.id, // Use ID as slug to ensure uniqueness and match legacy IDs
          description: sanitize(product.description),
          category: product.category,
          price:
            typeof product.price === 'string'
              ? parseFloat(product.price)
              : product.price,
          stock:
            typeof product.stock === 'string'
              ? parseInt(product.stock)
              : product.stock,
          imageUrl: finalImageUrl,
        },
      });
      successCount++;
    } catch (e) {
      console.error(`Error inserting ${product.name}:`, e);
    }
  }

  console.log(
    `✅ Successfully seeded ${successCount}/${productsToSeed.length} products.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
