import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// We need to import the data. Since it's a TS file in src, we utilize ts-node loader when running this script.
// Relative path from scripts/ folder to src/data/products.ts
import { products } from '../src/data/products.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'products.json');

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const data = {
  updatedAt: new Date().toISOString(),
  products: products,
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');

console.log(`✅ Products extracted to ${OUTPUT_FILE}`);
console.log(`Total products: ${products.length}`);
