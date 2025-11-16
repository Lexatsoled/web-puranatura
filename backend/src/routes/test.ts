import type { FastifyInstance } from 'fastify';
import { requireRole } from '../middleware/auth';
import { productService } from '../services/productService';

const isDevelopment = () => (process.env.NODE_ENV ?? 'development') === 'development';

export async function testRoutes(app: FastifyInstance) {
  if (!isDevelopment()) {
    return;
  }

  app.get(
    '/test/product/:id',
    {
      preHandler: [requireRole('admin')],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const product = await productService.getProductById(id);

      if (!product) {
        return reply.status(404).send({
          error: 'Producto no encontrado',
        });
      }

      return reply.send({
        debug: 'productService',
        product,
      });
    },
  );
}
