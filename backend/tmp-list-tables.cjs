const { PrismaClient } = require('@prisma/client');
(async () => {
  const client = new PrismaClient({
    datasources: { db: { url: 'file:./prisma/dev.db' } },
  });
  const tables = await client.$queryRawUnsafe(
    "SELECT name FROM sqlite_master WHERE type='table';"
  );
  console.log(JSON.stringify(tables, null, 2));
  await client.$disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
