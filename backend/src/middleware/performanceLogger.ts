import type { FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../config/logger.js';

export async function performanceLogger(request: FastifyRequest, reply: FastifyReply) {
  const start = Date.now();

  const onFinish = () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      logger.warn(
        {
          method: request.method,
          url: request.url,
          duration: `${duration}ms`,
        },
        'Slow request detected',
      );
    }

    reply.raw.off('finish', onFinish);
    reply.raw.off('close', onFinish);
  };

  reply.raw.on('finish', onFinish);
  reply.raw.on('close', onFinish);
}
