import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { testRoutes } from '../test';
import { productService } from '../../services/productService';

const requireRoleMock = vi.fn((role: string) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.headers['x-test-admin'] !== '1') {
      reply.status(403).send({ error: 'forbidden' });
    }
  };
});

vi.mock('../../middleware/auth', () => ({
  requireRole: (role: string) => requireRoleMock(role),
}));

vi.mock('../../services/productService', () => ({
  productService: {
    getProductById: vi.fn(),
  },
}));

describe('/test/product/:id route', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('returns product for admin in development', async () => {
    process.env.NODE_ENV = 'development';
    const app = Fastify();
    await testRoutes(app);
    await app.ready();

    const productServiceMock = vi.mocked(productService);
    productServiceMock.getProductById.mockResolvedValue({ id: '1', name: 'Test Product' } as any);

    const response = await app.inject({
      method: 'GET',
      url: '/test/product/1',
      headers: {
        'x-test-admin': '1',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().product).toEqual({ id: '1', name: 'Test Product' });
    expect(productService.getProductById).toHaveBeenCalledWith('1');
    expect(requireRoleMock).toHaveBeenCalledWith('admin');
  });

  it('returns 404 in production', async () => {
    process.env.NODE_ENV = 'production';
    const app = Fastify();
    await testRoutes(app);
    await app.ready();

    const response = await app.inject({
      method: 'GET',
      url: '/test/product/1',
    });

    expect(response.statusCode).toBe(404);
    expect(requireRoleMock).not.toHaveBeenCalled();
  });
});
