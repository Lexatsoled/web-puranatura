import Fastify, { type FastifyInstance } from 'fastify';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { productRoutes } from '../v1/products';
import { productService } from '../../services/productService';

vi.mock('../../services/productService', () => ({
  productService: {
    searchBySystem: vi.fn(),
  },
}));

const emptyResult = {
  products: [],
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 1,
  nextCursor: null,
  prevCursor: null,
  hasMore: false,
};

describe('GET /system/:systemId', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = Fastify();
    await productRoutes(app);
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
    vi.clearAllMocks();
  });

  it('returns products when productService resolves', async () => {
    vi.mocked(productService.searchBySystem).mockResolvedValue({
      ...emptyResult,
      products: [{ id: '1', name: 'Test' }],
      total: 1,
    } as any);

    const response = await app.inject({
      method: 'GET',
      url: '/system/sistema-inmune',
      query: { limit: 5 },
    });

    expect(response.statusCode).toBe(200);
    expect(productService.searchBySystem).toHaveBeenCalledWith(
      'sistema-inmune',
      expect.objectContaining({ limit: 5 }),
    );
    expect(response.json().total).toBe(1);
  });

  it('ignores request bodies so clients are not rejected por body validation', async () => {
    vi.mocked(productService.searchBySystem).mockResolvedValue(emptyResult as any);

    const response = await app.inject({
      method: 'GET',
      url: '/system/sistema-cardiaco',
      payload: { unexpected: true },
    });

    expect(response.statusCode).toBe(200);
    expect(productService.searchBySystem).toHaveBeenCalled();
  });
});
