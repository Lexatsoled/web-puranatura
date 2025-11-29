// DEPRECATED: utility used during local debugging. Kept for historical
// traceability only — tests and tooling now cover the startup/seed behavior.
// Remove this file if you prefer to keep the repo tidy.

/*
import { prisma } from '../src/prisma';

(async () => {
  try {
    const c = await prisma.product.count();
    // eslint-disable-next-line no-console
    console.log('[check_prisma] product count:', c);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[check_prisma] ERROR:', err && err.message ? err.message : err);
  } finally {
    await prisma.$disconnect();
  }
})();
*/
