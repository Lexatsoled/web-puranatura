import { PrismaClient } from '@prisma/client';
import path from 'path';

// Ensure DATABASE_URL points to an absolute sqlite file path when using
// a file: URL. This prevents "Unable to open the database file" errors
// if the server is started from a different working directory.
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')) {
  try {
    const filePath = process.env.DATABASE_URL.replace(/^file:/, '');
    // If it's a relative path, resolve it relative to the backend root.
    if (!path.isAbsolute(filePath)) {
      const resolved = path.resolve(__dirname, '..', filePath);
      process.env.DATABASE_URL = `file:${resolved}`;
      // eslint-disable-next-line no-console
      console.log('[prisma] normalized DATABASE_URL to', process.env.DATABASE_URL);
    }
  } catch (e) {
    // If anything goes wrong here we don't want to crash on import — Prisma
    // will throw later and be handled at runtime.
    // eslint-disable-next-line no-console
    console.warn('[prisma] failed to normalize DATABASE_URL', e);
  }
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
