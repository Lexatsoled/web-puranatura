const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const prod = await prisma.product.findFirst();
    console.log(prod?.id ?? '');
  } finally {
    await prisma.$disconnect();
  }
})();
