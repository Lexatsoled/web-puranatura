import Fastify from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

process.env.API_VERSION_DEFAULT = 'v1';
process.env.API_V1_SUNSET_DATE = '2026-06-01';

const sampleProduct = {
  id: 2,
  name: 'Producto V2',
  description: null,
  price: 25,
  compareAtPrice: null,
  stock: 10,
  category: 'cuidado',
  subcategory: null,
  categories: [],
  sku: 'V2SKU',
  isFeatured: false,
  images: [],
  benefits: [],
  benefitsDescription: [],
  ingredients: [],
  usage: null,
  dosage: null,
  administrationMethod: null,
  warnings: null,
  rating: 5,
  reviewCount: 3,
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
  getFeaturedProducts: vi.fn().mockReturnValue([sampleProduct]),
  searchProducts: vi.fn(),
  getProductsByCategory: vi.fn(),
  searchBySystem: vi.fn(),
  getProductById: vi.fn(),
};

vi.mock('../../services/productService.js', () => ({
  productService: productServiceMock,
}));

describe('v2 product routes', () => {
  let app: ReturnType<typeof Fastify>;

  beforeEach(async () => {
    const { productRoutes } = await import('../products.js');
    app = Fastify({ logger: false });
    await app.register(productRoutes, { prefix: '/api/v2/products' });
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
    vi.clearAllMocks();
  });

  it('retorna campos adicionales para productos v2', async () => {
    productServiceMock.getAllProducts.mockResolvedValueOnce(productListResult);
    const response = await app.inject({
      method: 'GET',
      url: '/api/v2/products',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.products[0].variants).toBeDefined();
    expect(body.products[0].reviews).toBeDefined();
  });

  it('mantiene compatibilidad con la estructura base de producto', async () => {
    productServiceMock.getAllProducts.mockResolvedValueOnce(productListResult);
    const response = await app.inject({
      method: 'GET',
      url: '/api/v2/products',
    });

    const body = response.json();
    expect(response.statusCode).toBe(200);
    expect(body.products).toBeDefined();
    expect(Array.isArray(body.products)).toBe(true);
    if (body.products.length > 0) {
      expect(body.products[0]).toHaveProperty('name');
      expect(body.products[0]).toHaveProperty('price');
      expect(body.products[0]).toHaveProperty('variants');
      expect(body.products[0]).toHaveProperty('reviews');
    }
  });
});
