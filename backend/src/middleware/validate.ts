import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZodError, ZodSchema } from 'zod';
import { schemaRegistry, SchemaKey } from '../schemas/index.js';
import { ValidationError } from '../errors/AppError.js';

type RequestSource = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, source: RequestSource = 'body') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const target = (request as Record<RequestSource, unknown>)[source] ?? {};
      const parsed = schema.parse(target);
      (request as Record<RequestSource, unknown>)[source] = parsed;
    } catch (error) {
      const zodError = error as ZodError;
      return reply.status(400).send({
        error: 'Validación fallida',
        details: zodError.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
  };
}

/**
 * Validar usando schema del registry
 */
export function validateSchema(key: SchemaKey, source: RequestSource = 'body') {
  const schema = schemaRegistry[key];
  return validate(schema, source);
}
