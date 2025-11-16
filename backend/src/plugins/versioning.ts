import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { config } from '../config/index.js';
import { versionMiddleware } from '../middleware/versionMiddleware.js';
import { productRoutes as productRoutesV1 } from '../routes/v1/products.js';
import { orderRoutes as orderRoutesV1 } from '../routes/v1/orders.js';
import { authRoutes as authRoutesV1 } from '../routes/v1/auth.js';
import { searchRoutes as searchRoutesV1 } from '../routes/v1/search.js';
import { adminRoutes as adminRoutesV1 } from '../routes/v1/admin.js';
import { sessionsRoutes as sessionsRoutesV1 } from '../routes/v1/sessions.js';
import { productRoutes as productRoutesV2 } from '../routes/v2/products.js';
import { orderRoutes as orderRoutesV2 } from '../routes/v2/orders.js';
import { deprecationWarning, calculateSunset, MIGRATION_GUIDE_URL } from '../utils/deprecation.js';

const registerV1Route = (fastify: FastifyInstance, route: unknown, suffix: string) => {
  const fallbackPrefix = `/api${suffix}`;
  const versionedPrefix = `/api/v1${suffix}`;
  return Promise.all([
    fastify.register(route as any, { prefix: fallbackPrefix }),
    fastify.register(route as any, { prefix: versionedPrefix }),
  ]);
};

const registerV2Route = (fastify: FastifyInstance, route: unknown, suffix: string) => {
  const prefix = `/api/v2${suffix}`;
  return fastify.register(route as any, { prefix });
};

const buildSunsetHeader = () => {
  const configured = config.API_V1_SUNSET_DATE;
  if (configured && !Number.isNaN(Date.parse(configured))) {
    return new Date(configured).toUTCString();
  }
  return calculateSunset(6);
};

export default fp(
  async function versioningPlugin(fastify: FastifyInstance) {
    fastify.addHook('onRequest', versionMiddleware);

    const sunsetHeader = buildSunsetHeader();
    fastify.addHook('onSend', async (request, reply) => {
      const currentVersion = request.versionContext?.negotiated ?? (config.API_VERSION_DEFAULT as string);
      if (currentVersion === 'v1') {
        const headers = deprecationWarning({
          version: 'v1',
          sunsetDate: sunsetHeader,
          message: 'La API v1 está en camino de ser retirada; migra a /api/v2',
          migrationUrl: MIGRATION_GUIDE_URL,
        });
        Object.entries(headers).forEach(([key, value]) => {
          reply.header(key, value);
        });
      }
    });

    await registerV1Route(fastify, authRoutesV1, '/auth');
    await registerV1Route(fastify, productRoutesV1, '/products');
    await registerV1Route(fastify, orderRoutesV1, '');
    await registerV1Route(fastify, searchRoutesV1, '');
    await registerV1Route(fastify, adminRoutesV1, '');
    await registerV1Route(fastify, sessionsRoutesV1, '');

    await registerV2Route(fastify, productRoutesV2, '/products');
    await registerV2Route(fastify, orderRoutesV2, '');
  },
  { name: 'versioning-plugin' },
);
