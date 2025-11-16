import fp from 'fastify-plugin';
import csrf from '@fastify/csrf-protection';
import cookie from '@fastify/cookie';
import type { FastifyInstance } from 'fastify';

const SAFE_HTTP_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);

export default fp(
  async function csrfPlugin(fastify: FastifyInstance) {
    const cookieSecret = process.env.COOKIE_SECRET || process.env.JWT_SECRET;

    if (!cookieSecret) {
      fastify.log.error('COOKIE_SECRET o JWT_SECRET deben estar configurados para CSRF');
      throw new Error('Missing COOKIE_SECRET or JWT_SECRET for CSRF protection');
    }

    const isProduction = process.env.NODE_ENV === 'production';

    await fastify.register(cookie, {
      secret: cookieSecret,
      parseOptions: {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
      },
    });

    await fastify.register(csrf, {
      cookieOpts: {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        signed: true,
      },
      getToken: (req) => {
        const headerToken = req.headers['x-csrf-token'];
        if (typeof headerToken === 'string') {
          return headerToken;
        }
        if (Array.isArray(headerToken)) {
          return headerToken[0];
        }

        const bodyToken =
          typeof req.body === 'object' && req.body !== null
            ? (req.body as Record<string, unknown>)._csrf
            : undefined;
        if (typeof bodyToken === 'string') {
          return bodyToken;
        }

        const queryToken =
          typeof req.query === 'object' && req.query !== null
            ? (req.query as Record<string, unknown>)._csrf
            : undefined;
        if (typeof queryToken === 'string') {
          return queryToken;
        }

        return undefined;
      },
    });

    fastify.addHook('preHandler', async (request, reply) => {
      const method = request.method?.toUpperCase() ?? 'GET';
      if (!SAFE_HTTP_METHODS.has(method)) {
        await new Promise<void>((resolve, reject) => {
          fastify.csrfProtection(request, reply, (err?: unknown) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    });
  },
  { name: 'csrf-protection' },
);
