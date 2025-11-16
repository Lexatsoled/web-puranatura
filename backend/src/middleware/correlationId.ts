import type { FastifyReply, FastifyRequest } from 'fastify';
import { createId } from '@paralleldrive/cuid2';

const HEADER_NAME = 'x-request-id';

export async function correlationId(request: FastifyRequest, reply: FastifyReply) {
  const incoming = request.headers[HEADER_NAME];
  const hasHeader = typeof incoming === 'string' && incoming.trim().length > 0;
  const correlationId = hasHeader ? incoming.trim() : createId();

  const baseLogger = request.log ?? request.server?.log;
  const boundLogger =
    baseLogger && typeof baseLogger.child === 'function'
      ? baseLogger.child({ correlationId })
      : baseLogger ?? request.log;

  if (boundLogger) {
    request.log = boundLogger;
  }
  reply.header('X-Request-ID', correlationId);
}
