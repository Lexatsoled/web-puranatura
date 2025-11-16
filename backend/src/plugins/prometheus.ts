import { FastifyPluginAsync } from 'fastify';
import client from 'prom-client';

const register = new client.Registry();

// Métricas por defecto
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register],
});

const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
  registers: [register],
});

export const prometheusPlugin: FastifyPluginAsync = async (fastify) => {
  // Track request duration
  fastify.addHook('onRequest', async (request) => {
    (request as any).startTime = Date.now();
    activeConnections.inc();
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const duration = (Date.now() - (request as any).startTime) / 1000;
    
    httpRequestDuration.observe(
      {
        method: request.method,
        route: request.routerPath || 'unknown',
        status_code: reply.statusCode,
      },
      duration
    );

    httpRequestTotal.inc({
      method: request.method,
      route: request.routerPath || 'unknown',
      status_code: reply.statusCode,
    });

    activeConnections.dec();
  });

  // Metrics endpoint
  fastify.get('/metrics', async (request, reply) => {
    reply.type('text/plain');
    return register.metrics();
  });
};

export { dbQueryDuration };