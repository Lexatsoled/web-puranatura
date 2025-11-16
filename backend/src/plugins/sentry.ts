import { FastifyPluginAsync } from 'fastify';
import * as Sentry from '@sentry/node';

export const sentryPlugin: FastifyPluginAsync = async (fastify) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        // Http and Express integrations if available
      ],
      
      tracesSampleRate: 0.1,
      profilesSampleRate: 0.1,
      
      environment: process.env.NODE_ENV,
      release: process.env.APP_VERSION,
    });

    // Request handler
    fastify.addHook('onRequest', async (request) => {
      Sentry.setContext('request', {
        url: request.url,
        method: request.method,
        headers: request.headers,
      });
    });

    // Error handler
    fastify.addHook('onError', async (request, reply, error) => {
      Sentry.captureException(error, {
        contexts: {
          request: {
            url: request.url,
            method: request.method,
            body: request.body,
          },
        },
      });
    });

    fastify.log.info('Sentry initialized');
  }
};