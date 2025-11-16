import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createRateLimitConfig } from '../../config/rateLimitRules';
import { productService } from '../../services/productService';
import { validate } from '../../middleware/validate';
import {
  categoryParamSchema,
  idParamSchema,
  productListQuerySchema,
  productSearchQuerySchema,
  systemParamSchema,
  type ProductListQuery,
  type ProductSearchQuery,
} from '../../types/validation';
import type {
  ProductBase,
  ProductListResult,
  ProductListResultV2,
  ProductV2,
} from '../../types/product';

const buildVariants = (product: ProductBase) => {
  const baseVariant = {
    id: `variant-${product.id}-base`,
    name: `${product.name} Clásico`,
    price: product.price,
    available: product.stock > 0,
    sku: product.sku,
    attributes: {
      size: 'Estándar',
      categoría: product.category,
      featured: product.isFeatured ? 'sí' : 'no',
    },
  };

  const premiumPrice = Number((product.price * 1.15).toFixed(2));
  const premiumVariant = {
    id: `variant-${product.id}-premium`,
    name: `${product.name} Premium`,
    price: premiumPrice,
    available: product.stock > 3,
    sku: product.sku ? `${product.sku}-PREM` : `PREM-${product.id}`,
    attributes: {
      size: 'Premium',
      tier: 'premium',
      categoría: product.category,
    },
  };

  return [baseVariant, premiumVariant];
};

const buildReviews = (product: ProductBase) => {
  const count = Math.min(Math.max(product.reviewCount, 0), 3);
  return Array.from({ length: count }, (_, index) => {
    const rating = Math.min(5, Math.max(1, Math.round(product.rating) - index));
    return {
      id: `review-${product.id}-${index + 1}`,
      rating,
      title: `Reseña #${index + 1} de ${product.name}`,
      body: `Comentario generado automáticamente para ${product.name}`,
      author: `Cliente ${index + 1}`,
      createdAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
      helpfulVotes: index,
    };
  });
};

const toProductV2 = (product: ProductBase): ProductV2 => ({
  ...product,
  variants: buildVariants(product),
  reviews: buildReviews(product),
});

const toListV2 = (result: ProductListResult): ProductListResultV2 => ({
  ...result,
  products: result.products.map(toProductV2),
});

async function handleError(request: FastifyRequest, reply: FastifyReply, error: unknown, message: string) {
  request.log.error(error);
  return reply.status(500).send({
    error: 'Error interno',
    message,
  });
}

export async function productRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      config: {
        rateLimit: createRateLimitConfig('publicApi'),
      },
      preHandler: validate(productListQuerySchema, 'query'),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const filters = request.query as ProductListQuery;
        const result = await productService.getAllProducts(filters);
        return reply.send(toListV2(result));
      } catch (error) {
        return handleError(request, reply, error, 'No se pudieron obtener los productos');
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
        const products = productService.getFeaturedProducts().map(toProductV2);
        return reply.send({ products, total: products.length });
      } catch (error) {
        return handleError(_request, reply, error, 'No se pudieron obtener los productos destacados');
      }
    },
  );

  app.get(
    '/search',
    {
      config: {
        rateLimit: createRateLimitConfig('search'),
      },
      preHandler: validate(productSearchQuerySchema, 'query'),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { q, limit } = request.query as ProductSearchQuery;
        const products = productService.searchProducts(q, limit).map(toProductV2);
        return reply.send({ products, total: products.length });
      } catch (error) {
        return handleError(request, reply, error, 'No se pudieron buscar productos');
      }
    },
  );

  app.get(
    '/category/:category',
    {
      config: {
        rateLimit: createRateLimitConfig('publicApi'),
      },
      preHandler: validate(categoryParamSchema, 'params'),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { category } = request.params as { category: string };
        const products = (await productService.getProductsByCategory(category)).map(toProductV2);
        return reply.send({ products, total: products.length });
      } catch (error) {
        return handleError(request, reply, error, 'No se pudieron obtener los productos por categoría');
      }
    },
  );

  app.get(
    '/:id',
    {
      config: {
        rateLimit: createRateLimitConfig('publicApi'),
      },
      preHandler: validate(idParamSchema, 'params'),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const product = await productService.getProductById(id);
        if (!product) {
          return reply.status(404).send({
            error: 'Producto no encontrado',
          });
        }
        return reply.send({ product: toProductV2(product) });
      } catch (error) {
        return handleError(request, reply, error, 'No se pudo obtener el producto solicitado');
      }
    },
  );

  app.get(
    '/system/:systemId',
    {
      config: {
        rateLimit: createRateLimitConfig('publicApi'),
      },
      preHandler: [validate(systemParamSchema, 'params'), validate(productListQuerySchema, 'query')],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { systemId } = request.params as { systemId: string };
        const filters = request.query as ProductListQuery;
        const products = await productService.searchBySystem(systemId, {
          ...filters,
          limit: filters.limit ?? 12,
          page: filters.page ?? 1,
        });
        return reply.send(toListV2(products));
      } catch (error) {
        return handleError(request, reply, error, 'Error al buscar productos del sistema');
      }
    },
  );
}
