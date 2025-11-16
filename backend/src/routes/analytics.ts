
import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { requireRole } from '../middleware/auth';
import { createRateLimitConfig } from '../config/rateLimitRules';

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  [key: string]: any;
}

export const vitalsStore: WebVital[] = [];
const MAX_VITALS = 500;
const MAX_PAYLOAD_SIZE = 10 * 1024; // 10 KB
const rawPayloadSchema = z
  .string()
  .max(MAX_PAYLOAD_SIZE, { message: 'Payload too large' });

export const analyticsRoutes: FastifyPluginAsync = async (fastify) => {
  // Recibir Web Vitals
  fastify.post('/analytics/vitals', {
    config: {
      rateLimit: createRateLimitConfig('publicApi'),
    },
    preHandler: async (request, reply) => {
      const rawPayload =
        typeof request.body === 'string' ? request.body : JSON.stringify(request.body ?? {});
      const parseResult = rawPayloadSchema.safeParse(rawPayload);

      if (!parseResult.success) {
        return reply.status(413).send({ error: 'Payload too large' });
      }
    },
  }, async (request, reply) => {
    const vital = request.body as WebVital;
    vitalsStore.push({
      ...vital,
      timestamp: Date.now(),
      userAgent: request.headers['user-agent'],
      url: request.headers.referer,
    });
    // Mantener solo últimos 500
    while (vitalsStore.length > MAX_VITALS) {
      vitalsStore.shift();
    }
    return reply.code(204).send();
  });

  // Recibir Long Tasks
  fastify.post('/analytics/long-tasks', async (request, reply) => {
    if (process.env.NODE_ENV === 'development') {
      fastify.log.debug({ body: request.body }, 'Long task received');
    }
    return reply.code(204).send();
  });

  // Ver métricas (admin)
  fastify.get('/admin/analytics/vitals', {
    preHandler: [requireRole('admin')],
    config: {
      rateLimit: createRateLimitConfig('admin'),
    },
  }, async (request, reply) => {
    const metrics = {
      lcp: calculateMetric('LCP'),
      fid: calculateMetric('FID'),
      cls: calculateMetric('CLS'),
      fcp: calculateMetric('FCP'),
      ttfb: calculateMetric('TTFB'),
      inp: calculateMetric('INP'),
    };
    return metrics;
  });
};

function calculateMetric(name: string) {
  const values = vitalsStore
    .filter(v => v.name === name)
    .map(v => v.value);
  if (values.length === 0) return null;
  return {
    p50: percentile(values, 0.5),
    p75: percentile(values, 0.75),
    p95: percentile(values, 0.95),
    count: values.length,
  };
}

function percentile(arr: number[], p: number): number {
  const sorted = arr.slice().sort((a, b) => a - b);
  const index = Math.ceil(sorted.length * p) - 1;
  return sorted[index];
}
