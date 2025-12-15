const fs = require('fs');
const path = require('path');

const PRODUCTS_PATH = path.join(__dirname, '../src/data/products.ts');
const MANIFEST_PATH = path.join(__dirname, '../src/data/image-manifest.json');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'products.json');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Read Files
const productsFileContent = fs
  .readFileSync(PRODUCTS_PATH, 'utf-8')
  .replace(/^\uFEFF/, '');
const imageManifest = JSON.parse(
  fs.readFileSync(MANIFEST_PATH, 'utf-8').replace(/^\uFEFF/, '')
);

// 2. Setup Helper Logic (Replicating exact logic from products.ts)
const manifestEntries = imageManifest;
const manifestMap = new Map(
  manifestEntries.map((entry) => [entry.slug, entry])
);

const FALLBACK_IMAGE = '/optimized/placeholder.svg';

// Extract imageAliasMap from file content
const aliasMapMatch = productsFileContent.match(
  /const imageAliasMap: Record<string, string> = {([\s\S]*?)};/
);
let imageAliasMap = {};
if (aliasMapMatch) {
  // Basic parser for the object body
  const body = aliasMapMatch[1];
  // Remove comments
  const CleanBody = body.replace(/\/\/.*$/gm, '');

  // Evaluate it safely-ish by wrapping in braces and JSON-ifying or just simple eval?
  // Since it's trusted code, eval is fine for this build script.
  try {
    const evalCode = `({${CleanBody}})`;
    imageAliasMap = eval(evalCode);
  } catch (e) {
    console.error('Failed to parse imageAliasMap via eval', e);
    // Fallback manual parse if needed, but eval should work for simple object
  }
}

const normalizeImageKey = (value) =>
  value
    .replace(/^\/?Jpeg\//i, '')
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const resolveImagePath = (value) => {
  if (!value) return FALLBACK_IMAGE;
  // Bypass resolution for already optimized or external images
  if (value.startsWith('/optimized/') || value.startsWith('http')) {
    return value;
  }
  const baseName = value.replace(/^\/?Jpeg\//i, '');
  const normalizedKey = normalizeImageKey(baseName);
  const slug = imageAliasMap[normalizedKey] ?? normalizedKey;
  return manifestMap.get(slug)?.path ?? FALLBACK_IMAGE;
};

const normalizeProductImages = (product) => ({
  ...product,
  images:
    product.images?.map((image) => ({
      ...image,
      thumbnail: resolveImagePath(image.thumbnail),
      full: resolveImagePath(image.full),
    })) ?? [],
});

// 3. Extract legacyProducts Array
// Find start
const startMarker = 'const legacyProducts: Product[] = [';
const startIndex = productsFileContent.indexOf(startMarker);

if (startIndex === -1) {
  console.error('Could not find legacyProducts start marker');
  process.exit(1);
}

// Find the end. It ends before "export const products"
const endMarker = 'export const products: Product[]';
const endIndex = productsFileContent.indexOf(endMarker);

if (endIndex === -1) {
  console.error('Could not find legacyProducts end marker');
  process.exit(1);
}

// Get the array string
let arrayString = productsFileContent
  .substring(startIndex + startMarker.length - 1, endIndex)
  .trim();
// Remove the last semicolon if present, but we stopped at export, so likely it ends with ];
// Actually we included the '[' in the logic above?
// Logic:
// Text: ... = [ ... ]; \n export ...
// we want: [ ... ];
// slice from startIndex + lengthOfPrefix (excluding [) -> wait.
// startMarker includes [. So startIndex + startMarker.length - 1 starts at [.

// We need to be careful with trailing chars.
// Let's clean up the end.
const lastBracket = arrayString.lastIndexOf(']');
const cleanedArrayString = arrayString.substring(0, lastBracket + 1);

// Now we evaluating this big array string.
// It contains unquoted keys (e.g. id: '1'), so JSON.parse won't work.
// We use eval.
let productsRaw;
try {
  productsRaw = eval(cleanedArrayString);
} catch (e) {
  console.error('Failed to eval legacyProducts array:', e.message);
  // Maybe comments are breaking it?
  // Let's try to strip comments?
  // Or just run node with the file included?
  process.exit(1);
}

console.log(`Extracted ${productsRaw.length} raw products.`);

// 4. Process Data
const processedProducts = productsRaw.map(normalizeProductImages);

// 5. Write JSON
const finalData = {
  updatedAt: new Date().toISOString(),
  products: processedProducts,
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2), 'utf-8');
console.log(
  `✅ Successfully wrote ${processedProducts.length} products to ${OUTPUT_FILE}`
);
