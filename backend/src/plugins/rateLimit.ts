import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { redis, isRedisEnabled } from '../config/redis';
import { verifyAccessToken } from '../services/authService';
import { config } from '../config';

const EXEMPT_PATHS = new Set(['/health', '/api/health', '/api/metrics']);
const whitelist = new Set(
  config.RATE_LIMIT_WHITELIST.split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);

const resolveUserIdentifier = (request: FastifyRequest): string | null => {
  if (request.user?.userId) {
    return String(request.user.userId);
  }

  const cookieToken =
    typeof request.cookies === 'object' && request.cookies
      ? (request.cookies as Record<string, string>).accessToken
      : undefined;

  const headerToken =
    typeof request.headers.authorization === 'string' &&
    request.headers.authorization.toLowerCase().startsWith('bearer ')
      ? request.headers.authorization.slice(7).trim()
      : undefined;

  const token = cookieToken || headerToken;
  if (!token) {
    return null;
  }

  const decoded = verifyAccessToken(token);
  if (decoded) {
    request.user = decoded;
    return String(decoded.userId);
  }

  return null;
};

export default fp(
  async function rateLimitPlugin(fastify: FastifyInstance) {
    await fastify.register(rateLimit, {
      global: true,
      redis: isRedisEnabled ? redis ?? undefined : undefined,
      max: async (_req: any, key: string) => {
        if (typeof key === 'string' && key.startsWith('user:')) {
          return 200;
        }
        return 100;
      },
      timeWindow: '1 minute',
      addHeaders: {
        'x-ratelimit-limit': true,
        'x-ratelimit-remaining': true,
        'x-ratelimit-reset': true,
      },
      keyGenerator: (req: any) => {
        const userId = resolveUserIdentifier(req);
        if (userId) {
          return `user:${userId}`;
        }
        return `anon:${req.ip}`;
      },
      skip: (req: any) => {
        if (whitelist.has(req.ip)) {
          return true;
        }
        const path = req.routerPath || req.url?.split('?')[0] || '';
        return EXEMPT_PATHS.has(path);
      },
      errorResponseBuilder: (_req: any, context: any) => {
        const retryAfterSeconds = Math.ceil(context.ttl / 1000);
        return {
          statusCode: 429,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
          retryAfter: retryAfterSeconds,
        };
      },
    } as any);

    fastify.addHook('onSend', async (request, reply) => {
      if (reply.statusCode === 429) {
        fastify.log.warn({
          msg: 'Rate limit exceeded',
          ip: request.ip,
          userId: request.user?.userId ?? null,
          path: request.routerPath ?? request.url,
          method: request.method,
        });
      }
    });
  },
  { name: 'rate-limit-plugin' },
);
