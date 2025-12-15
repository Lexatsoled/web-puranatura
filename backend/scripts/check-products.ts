import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Ensure DATABASE_URL is set correctly for SQLite file path if relative
let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
  dbUrl = `file:${dbPath}`;
} else if (dbUrl.startsWith('file:')) {
  const dbPath = dbUrl.replace('file:', '');
  if (!path.isAbsolute(dbPath)) {
    dbUrl = `file:${path.resolve(process.cwd(), dbPath)}`;
  }
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

async function main() {
  const allProducts = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
  });

  console.log(`Found ${allProducts.length} products in DB.`);
  const oilProducts = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes('aceite') ||
      p.name.toLowerCase().includes('oil')
  );
  console.log('--- OIL PRODUCTS ---');
  oilProducts.forEach((p) => console.log(p.name, p.imageUrl));

  if (oilProducts.length === 0) {
    console.log('No "Aceite" or "Oil" products found in DB? listing first 10:');
    allProducts.slice(0, 10).forEach((p) => console.log(p.name));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
