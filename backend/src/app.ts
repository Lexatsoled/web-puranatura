import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { config } from './config/index.js';
import csrfPlugin from './plugins/csrf.js';
import rateLimitPlugin from './plugins/rateLimit.js';
import securityHeadersPlugin from './plugins/securityHeaders.js';
import poolStatsPlugin from './plugins/poolStats.js';
import healthChecksPlugin from './plugins/healthChecks.js';
import { sentryPlugin } from './plugins/sentry.js';
import { prometheusPlugin } from './plugins/prometheus.js';
import { healthRoutes } from './routes/health.js';
import compressionPlugin from './plugins/compression.js';
import './jobs/cleanupSessions.js';
import './jobs/backupJob.js';
import { logger } from './config/logger.js';
import { correlationId } from './middleware/correlationId.js';
import { performanceLogger } from './middleware/performanceLogger.js';
import { cspReportRoutes } from './routes/csp-report.js';
import { closeRedis } from './config/redis.js';
import { closeConnectionPool } from './db/index.js';
import versioningPlugin from './plugins/versioning.js';
import { analyticsRoutes } from './routes/analytics.js';
import { sitemapRoutes } from './routes/sitemap.js';
import { testRoutes } from './routes/test.js';

export async function buildApp(options: FastifyServerOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({ logger, ...options });

  await app.register(securityHeadersPlugin);

  const allowedOrigins = config.ALLOWED_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  await app.register(cors, {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['X-CSRF-Token'],
  });

  await app.register(csrfPlugin);
  await app.register(rateLimitPlugin);
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });
  await app.register(poolStatsPlugin);
  await app.register(healthChecksPlugin);
  await app.register(compressionPlugin);
  await app.register(sentryPlugin);
  await app.register(prometheusPlugin);

  app.addHook('onRequest', correlationId);
  app.addHook('onRequest', performanceLogger);

  app.addHook('onResponse', async (request, reply) => {
    // Logging is handled by httpLogger
  });

  app.addHook('onError', async (request, reply, error) => {
    logger.error(
      {
        err: error,
        req: {
          method: request.method,
          url: request.url,
          params: request.params,
          query: request.query,
        },
      },
      'Unhandled error',
    );
  });

  const { csrfRoutes } = await import('./routes/csrf.js');
  await app.register(csrfRoutes, { prefix: '/api' });

  await app.register(versioningPlugin);

  await app.register(healthRoutes);

  const { uploadRoutes } = await import('./routes/upload.js');
  await app.register(uploadRoutes, { prefix: '/api' });

  await app.register(cspReportRoutes, { prefix: '/api' });

  await app.register(analyticsRoutes, { prefix: '/api' });

  await app.register(sitemapRoutes);

  if (config.NODE_ENV === 'development') {
    await app.register(testRoutes, { prefix: '/api' });
  }

  app.setErrorHandler((error, request, reply) => {
    (app.log.error as any)({ err: error }, 'Request error');
    const isDev = config.NODE_ENV === 'development';
    reply.status(error.statusCode || 500).send({
      error: isDev ? error.message : 'Error interno del servidor',
      ...(isDev && { stack: error.stack }),
    });
  });

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: 'Ruta no encontrada',
      path: request.url,
    });
  });

  app.addHook('onClose', async () => {
    await closeRedis();
    await closeConnectionPool();
  });

  return app;
}
