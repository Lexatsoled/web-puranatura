require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

(async function main() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.product.count();
    console.log('PRODUCT_COUNT', count);
  } catch (err) {
    console.error('ERROR', err.message || err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
