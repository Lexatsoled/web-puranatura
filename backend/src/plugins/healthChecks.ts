import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { healthConfig } from '../config/health.js';
import {
  checkDatabase,
  checkFilesystem,
  checkMemory,
  checkRedis,
} from '../utils/healthCheckers.js';
import type { HealthCheckResult, HealthChecksService, HealthSnapshot } from '../types/health.js';

const buildSnapshot = (checks: HealthCheckResult[]): HealthSnapshot => {
  const healthy = checks.every((check) => check.healthy);
  const status = checks.length === 0 ? 'disabled' : healthy ? 'healthy' : 'degraded';

  return {
    checks,
    status,
    timestamp: new Date().toISOString(),
  };
};

export const healthChecksPlugin = fp(async (fastify: FastifyInstance) => {
  const checkFactories = [
    { name: 'database', fn: checkDatabase },
    { name: 'redis', fn: checkRedis },
    { name: 'filesystem', fn: checkFilesystem },
    { name: 'memory', fn: async () => checkMemory() },
  ];

  let snapshot = buildSnapshot([]);

  const runChecks = async (): Promise<HealthSnapshot> => {
    const results = await Promise.all(
      checkFactories.map(async ({ name, fn }) => {
        const startedAt = Date.now();
        try {
          const result = await fn();
          return {
            ...result,
            name,
            durationMs: result.durationMs ?? Date.now() - startedAt,
          };
        } catch (error) {
          return {
            name,
            healthy: false,
            error: error instanceof Error ? error.message : String(error),
            durationMs: Date.now() - startedAt,
          };
        }
      }),
    );

    snapshot = buildSnapshot(results);
    return snapshot;
  };

  if (healthConfig.enabled) {
    try {
      await runChecks();
    } catch (error) {
      fastify.log.warn({ err: error }, 'Initial health checks failed');
    }

    const interval = setInterval(() => {
      runChecks().catch((error) => {
        fastify.log.warn({ err: error }, 'Background health check failed');
      });
    }, healthConfig.interval);

    fastify.addHook('onClose', () => {
      clearInterval(interval);
    });
  } else {
    snapshot = buildSnapshot([]);
    fastify.log.info('Health checks disabled via configuration');
  }

  const service: HealthChecksService = {
    getSnapshot: () => snapshot,
    runChecks,
  };

  fastify.decorate('healthChecks', service);
});

export default healthChecksPlugin;
