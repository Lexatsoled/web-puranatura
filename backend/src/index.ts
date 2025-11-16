import type { FastifyInstance } from 'fastify';
import { buildApp } from './app.js';
import { config } from './config/index.js';
import { connectRedis } from './config/redis.js';
import { closeConnectionPool, getWALManager } from './db/index.js';
import { logger } from './config/logger.js';

let appInstance: FastifyInstance | null = null;

const start = async () => {
  try {
    await connectRedis();
  } catch (error) {
    logger.warn({ error }, 'Redis connection failed, using in-memory cache fallback');
  }

  const app = await buildApp();
  appInstance = app;

  if (config.NODE_ENV !== 'test') {
    getWALManager();
  }

  try {
    await app.listen({ port: config.PORT, host: '0.0.0.0' });
    logger.info(`Servidor corriendo en http://localhost:${config.PORT}`);
    logger.info(`Health check: http://localhost:${config.PORT}/health`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

async function gracefulShutdown(signal: string) {
  logger.info({ signal }, 'Received shutdown signal');
  try {
    if (appInstance) {
      await appInstance.close();
      appInstance = null;
    }
    await closeConnectionPool();
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during shutdown');
    process.exit(1);
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

start();
