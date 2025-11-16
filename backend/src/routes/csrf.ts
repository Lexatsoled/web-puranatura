import type { FastifyInstance } from 'fastify';

export async function csrfRoutes(app: FastifyInstance) {
  app.get('/csrf-token', async (_request, reply) => {
    const csrfToken = await reply.generateCsrf();
    return reply.send({ csrfToken });
  });
}
