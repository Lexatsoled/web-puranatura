import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ZodSchema, ZodError } from 'zod';

// TODO: Middleware genérico de validación con Zod
export function validate(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Validar el body del request con el schema de Zod
      request.body = schema.parse(request.body);
    } catch (error) {
      // Si la validación falla, retornar 400 Bad Request con detalles
      const zodError = error as ZodError;
      
      return reply.status(400).send({
        error: 'Validación fallida',
        details: zodError.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
  };
}
