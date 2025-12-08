import 'dotenv/config';
import '../src/config/env';
import { PrismaClient } from '@prisma/client';
import { logger } from '../src/utils/logger';

const prisma = new PrismaClient();

const performMaintenance = async () => {
  logger.info('Starting database maintenance...');
  const start = Date.now();

  try {
    // 1. Optimize query analyzer
    // SQLite's PRAGMA optimize is recommended to be run periodically
    logger.info('Running PRAGMA optimize...');
    await prisma.$executeRawUnsafe('PRAGMA optimize;');

    // 2. Vacuum to reclaim unused space
    // Only needed occasionally or if auto_vacuum is incremental/none
    logger.info('Running VACUUM...');
    await prisma.$executeRawUnsafe('VACUUM;');

    // 3. Optional: WAL checkpointing if in WAL mode (usually automatic, but good to force on maintenance)
    // await prisma.$executeRawUnsafe('PRAGMA wal_checkpoint(TRUNCATE);');

    const duration = Date.now() - start;
    logger.info(
      `Database maintenance completed successfully in ${duration}ms.`
    );
  } catch (error) {
    logger.error('Database maintenance failed', { error });
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

performMaintenance();
