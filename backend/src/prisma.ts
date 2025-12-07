import { PrismaClient } from '@prisma/client';
import path from 'path';
import { env } from './config/env';

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
      console.log(
        '[prisma] normalized DATABASE_URL to',
        process.env.DATABASE_URL
      );
    }
  } catch (e) {
    // If anything goes wrong here we don't want to crash on import - Prisma
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
    // En SQLite aplicar pragmas para reducir bloqueos: WAL + busy timeout
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

const applySQLitePragmas = async () => {
  if (
    !process.env.DATABASE_URL ||
    !process.env.DATABASE_URL.startsWith('file:')
  )
    return;
  try {
    const busy = env.sqliteBusyTimeoutMs;
    const { journalMode, synchronous } = env.sqlitePragmas;
    // PRAGMA devuelve filas; usa queryRawUnsafe para evitar el error P2010.
    await prisma.$queryRawUnsafe(`PRAGMA busy_timeout = ${busy};`);
    await prisma.$queryRawUnsafe(`PRAGMA journal_mode = ${journalMode};`);
    await prisma.$queryRawUnsafe(`PRAGMA synchronous = ${synchronous};`);
    // eslint-disable-next-line no-console
    console.info(
      `[prisma] pragmas applied (journal_mode=${journalMode}, synchronous=${synchronous}, busy_timeout=${busy}ms)`
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[prisma] failed to apply sqlite pragmas', err);
  }
};

// Configura WAL/timeout al cargar el cliente (no bloqueante).
void applySQLitePragmas();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
