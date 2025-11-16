import type { FastifyInstance } from 'fastify';
import type { HealthCheckResult, HealthSnapshot } from '../types/health.js';

const buildBaseResponse = (snapshot: HealthSnapshot) => ({
  checks: snapshot.checks,
  timestamp: snapshot.timestamp,
  uptime: Number(process.uptime().toFixed(2)),
});

const getSnapshot = (app: FastifyInstance): HealthSnapshot => {
  return app.healthChecks?.getSnapshot() ?? {
    checks: [],
    status: 'disabled',
    timestamp: new Date().toISOString(),
  };
};

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async (_request, reply) => {
    const snapshot = getSnapshot(app);
    const hasCheckFailures = snapshot.checks.some((check) => !check.healthy);
    const statusCode = snapshot.status === 'healthy' && !hasCheckFailures ? 200 : 503;

    return reply.code(statusCode).send({
      status: statusCode === 200 ? 'healthy' : 'degraded',
      ...buildBaseResponse(snapshot),
    });
  });

  app.get('/health/ready', async (_request, reply) => {
    const snapshot = getSnapshot(app);
    const criticalNames = new Set(['database', 'redis']);
    const criticalChecks = snapshot.checks.filter((check) => criticalNames.has(check.name));
    const ready = criticalChecks.every((check) => check.healthy);
    const payloadChecks = criticalChecks.length > 0 ? criticalChecks : snapshot.checks;

    return reply.code(ready ? 200 : 503).send({
      status: ready ? 'ready' : 'not ready',
      ...buildBaseResponse({
        ...snapshot,
        checks: payloadChecks,
      }),
    });
  });

  app.get('/health/live', async (_request, reply) => {
    return reply.code(200).send({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: Number(process.uptime().toFixed(2)),
    });
  });
}
