import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Helper to generate a slug from a name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

async function main() {
  const jsonPath = path.join(__dirname, '../../public/data/products.json');
  console.log(`[RESTORE] Reading products from ${jsonPath}...`);

  try {
    const data = await fs.readFile(jsonPath, 'utf-8');
    const { products } = JSON.parse(data);

    console.log(`[RESTORE] Found ${products.length} products in JSON.`);

    let importedCount = 0;

    for (const p of products) {
      const slug = generateSlug(p.name);
      const imageUrl =
        p.images && p.images.length > 0 ? p.images[0].full : null;

      // Price in JSON is float, Stock is int
      // JSON has 'category' (string), 'description' (string)

      console.log(`[RESTORE] Processing: ${p.name} -> ${slug}`);

      await prisma.product.upsert({
        where: { slug },
        update: {
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          stock: p.stock || 0,
          imageUrl: imageUrl,
        },
        create: {
          name: p.name,
          slug,
          description: p.description,
          price: p.price,
          category: p.category,
          stock: p.stock || 0,
          imageUrl: imageUrl,
        },
      });
      importedCount++;
    }

    console.log(`[RESTORE] Successfully upserted ${importedCount} products.`);
  } catch (error) {
    console.error('[RESTORE] Error importing products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
