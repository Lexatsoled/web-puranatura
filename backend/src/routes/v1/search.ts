import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { searchService } from '../../services/searchService.js';
import { validate } from '../../middleware/validate';
import {
  searchQuerySchema,
  searchSuggestQuerySchema,
  type SearchQuery,
  type SearchSuggestQuery,
} from '../../types/validation';
import { createRateLimitConfig } from '../../config/rateLimitRules';
import { requireRole } from '../../middleware/auth';

export async function searchRoutes(app: FastifyInstance) {
  app.get(
    '/search',
    {
      config: {
        rateLimit: createRateLimitConfig('search'),
      },
      preHandler: validate(searchQuerySchema, 'query'),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const query = request.query as SearchQuery;
        const result = await searchService.search({
          query: query.q,
          limit: query.limit,
          offset: query.offset,
          category: query.category,
          priceMin: query.priceMin,
          priceMax: query.priceMax,
          inStock: query.inStock,
        });
        return reply.send(result);
      } catch (error) {
        request.log.error({ err: error }, 'Search failed');
        return reply.status(500).send({
          error: 'No se pudo realizar la bǭsqueda',
        });
      }
    },
  );

  app.get(
    '/search/suggest',
    {
      config: {
        rateLimit: createRateLimitConfig('search'),
      },
      preHandler: validate(searchSuggestQuerySchema, 'query'),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const query = request.query as SearchSuggestQuery;
        const suggestions = await searchService.suggest(query.q, query.limit);
        return reply.send({ suggestions });
      } catch (error) {
        request.log.error({ err: error }, 'Suggest failed');
        return reply.status(500).send({
          error: 'No se pudieron obtener sugerencias',
        });
      }
    },
  );

  app.get(
    '/search/popular',
    {
      config: {
        rateLimit: createRateLimitConfig('publicApi'),
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const searches = await searchService.getPopularSearches(10);
        return reply.send({ searches });
      } catch (error) {
        _request.log.error({ err: error }, 'Popular search failed');
        return reply.status(500).send({
          error: 'No se pudieron obtener las bǭsquedas populares',
        });
      }
    },
  );

  app.post(
    '/search/reindex',
    {
      config: {
        rateLimit: createRateLimitConfig('admin'),
      },
      preHandler: [requireRole('admin')],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await searchService.reindex();
        return reply.send(result);
      } catch (error) {
        request.log.error({ err: error }, 'Reindex failed');
        return reply.status(500).send({
          error: 'No se pudo reindexar',
        });
      }
    },
  );
}
