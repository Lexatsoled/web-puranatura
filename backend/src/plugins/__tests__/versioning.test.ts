import Fastify from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.API_VERSION_DEFAULT = 'v1';
process.env.API_V1_SUNSET_DATE = '2026-06-01';

const sampleProduct = {
  id: 1,
  name: 'Test Product',
  description: null,
  price: 10,
  compareAtPrice: null,
  stock: 5,
  category: 'bienestar',
  subcategory: null,
  categories: [],
  sku: 'SKU-1',
  isFeatured: true,
  images: [],
  benefits: [],
  benefitsDescription: [],
  ingredients: [],
  usage: null,
  dosage: null,
  administrationMethod: null,
  warnings: null,
  rating: 4,
  reviewCount: 2,
  detailedDescription: null,
  mechanismOfAction: null,
  healthIssues: [],
  components: [],
  faqs: [],
  scientificReferences: [],
  tags: [],
  priceNote: null,
  createdAt: new Date().toISOString(),
};

const productListResult = {
  products: [sampleProduct],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
  nextCursor: null,
  prevCursor: null,
  hasMore: false,
};

const productServiceMock = {
  getAllProducts: vi.fn().mockResolvedValue(productListResult),
  getFeaturedProducts: vi.fn().mockReturnValue([]),
  searchProducts: vi.fn().mockResolvedValue([]),
  getProductsByCategory: vi.fn().mockResolvedValue([]),
  searchBySystem: vi.fn().mockResolvedValue(productListResult),
  getProductById: vi.fn().mockResolvedValue(null),
};

class OrderNotFoundError extends Error {}
class InvalidStatusTransitionError extends Error {}

const orderServiceMock = {
  listOrders: vi.fn().mockResolvedValue({ data: [], nextCursor: null, hasMore: false }),
  getOrderById: vi.fn().mockResolvedValue(null),
  updateOrderStatus: vi.fn().mockResolvedValue(null),
  getStats: vi.fn().mockResolvedValue({
    totalOrders: 0,
    totalRevenue: 0,
    ordersByStatus: [],
    recentOrders: [],
  }),
};

vi.mock('../../services/productService.js', () => ({
  productService: productServiceMock,
}));

vi.mock('../../services/orderService.js', () => ({
  OrderService: orderServiceMock,
  OrderNotFoundError,
  InvalidStatusTransitionError,
}));

describe('versioningPlugin', () => {
  let app: ReturnType<typeof Fastify>;

  const createApp = async () => {
    const instance = Fastify({ logger: false });
    const { default: versioningPlugin } = await import('../versioning.js');
    await instance.register(versioningPlugin);
    await instance.ready();
    return instance;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('debe enrutar a v1 correctamente', async () => {
    app = await createApp();
    
    productServiceMock.getAllProducts.mockResolvedValueOnce({
      products: [sampleProduct],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      nextCursor: null,
      prevCursor: null,
      hasMore: false,
    });
    
    const response = await app.inject({
      method: 'GET',
      url: '/api/products',
    });

    expect(response.statusCode).toBe(200);
    expect(productServiceMock.getAllProducts).toHaveBeenCalled();
    const body = response.json();
    expect(body.products).toHaveLength(1);
    expect(body.products[0].name).toBe(sampleProduct.name);
  }, 10000);

  it('debe enrutar a v2 correctamente', async () => {
    app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v2/products',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.products[0].variants).toBeDefined();
    expect(body.products[0].reviews).toBeDefined();
    expect(response.headers.deprecation).toBeUndefined();
  });

  it('debe usar v1 como default sin versión y exponer headers de deprecación', async () => {
    app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/products',
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers.sunset).toBe(new Date('2026-06-01').toUTCString());
    expect(response.headers.deprecation).toContain('La API v1');
    expect(response.headers.link).toContain('MIGRATION_v1_to_v2');
  });
});
