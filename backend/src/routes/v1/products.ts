import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { productService } from '../../services/productService';
import { CreateProductSchema, schemaRegistry } from '../../schemas/index.js';
import { validateSchema } from '../../middleware/validate.js';
import { createRateLimitConfig } from '../../config/rateLimitRules';
import type { infer as Infer } from 'zod';

// Ajuste para usar el tipo derivado del schema
import { ProductFiltersSchema } from '../../schemas/index.js';

type ProductFilters = Infer<typeof ProductFiltersSchema>;

export async function productRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      config: {
        rateLimit: createRateLimitConfig('publicApi'),
      },
      preHandler: validateSchema('product.filters', 'query'),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const filters = request.query as ProductFilters;
        const result = await productService.getAllProducts(filters);
        return reply.send(result);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
          error: 'No se pudieron obtener los productos',
        });
      }
    },
  );

  app.get(
    '/featured',
    {
      config: {
        rateLimit: createRateLimitConfig('publicApi'),
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const products = productService.getFeaturedProducts();
        return reply.send({ products, total: products.length });
      } catch (error) {
        _request.log.error(error);
        return reply.status(500).send({
          error: 'No se pudieron obtener los productos destacados',
        });
      }
    },
  );

  app.get(
    '/search',
    {
      config: {
        rateLimit: createRateLimitConfig('search'),
      },
      preHandler: validateSchema('product.filters', 'query'),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        let { q = '' } = request.query as ProductFilters; // Valor por defecto para evitar undefined
        
        // SEC-INPUT-001: Validate query length to prevent DoS
        if (q && typeof q === 'string') {
          if (q.length > 200) {
            return reply.status(400).json({
              error: 'Query parameter too long (max 200 characters)'
            });
          }
          q = q.substring(0, 200);
        }
        
        const { limit } = request.query as ProductFilters;
        const products = productService.searchProducts(q, limit);
        return reply.send({ products, total: products.length });
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
          error: 'No se pudieron buscar productos',
        });
      }
    },
  );

  app.get(
    '/category/:category',
    {
      config: {
        rateLimit: createRateLimitConfig('publicApi'),
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { category } = request.params as { category: string };
        const products = await productService.getProductsByCategory(category);
        return reply.send({ products, total: products.length });
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
          error: 'No se pudieron obtener los productos por categoría',
        });
      }
    },
  );

  app.get(
    '/:id',
    {
      config: {
        rateLimit: createRateLimitConfig('publicApi'),
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        console.log('🔥 ROUTE DEBUG: Buscando producto', id);
        const product = await productService.getProductById(id);
        console.log('🔥 ROUTE DEBUG: Producto encontrado:', product?.name, 'images:', product?.images);
        if (!product) {
          return reply.status(404).send({
            error: 'Producto no encontrado',
          });
        }
        return reply.send({ product });
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
          error: 'No se pudo obtener el producto solicitado',
        });
      }
    },
  );

  app.get(
    '/system/:systemId',
    {
      config: {
        rateLimit: createRateLimitConfig('publicApi'),
      },
      preHandler: validateSchema('product.filters', 'query'),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { systemId } = request.params as { systemId: string };
        const filters = request.query as ProductFilters;
        const products = await productService.searchBySystem(systemId, {
          ...filters,
          limit: filters.limit ?? 12,
          page: filters.page ?? 1,
        });
        return reply.send(products);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({
          error: 'Error al buscar productos del sistema',
        });
      }
    },
  );
}
