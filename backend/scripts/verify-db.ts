import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    console.log(`[VERIFY] Users: ${userCount}`);
    console.log(`[VERIFY] Products: ${productCount}`);

    if (userCount > 0 || productCount > 0) {
      console.log('[VERIFY] SUCCESS: Database has data.');
    } else {
      console.log('[VERIFY] WARNING: Database is empty.');
    }
  } catch (e) {
    console.error('[VERIFY] ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
