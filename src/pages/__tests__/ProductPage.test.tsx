import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import ProductPage from '../ProductPage';

// Mock products base data and loader for full product
vi.mock('../../data/products', () => ({
  products: [
    {
      id: 'p1',
      name: 'Producto Uno',
      description: 'Desc',
      price: 12,
      categories: ['c1'],
      images: [{ full: 'f.jpg', thumbnail: 't.jpg' }],
      stock: 10,
      sku: 'SKU1',
      tags: [],
    },
  ],
}));

vi.mock('../../data/products/loader', () => ({
  loadProductById: vi.fn(async (id: string) => (id === 'p1' ? { rating: 5 } : undefined)),
  normalizeProductText: (p: unknown) => p,
}));

// Mock cart and wishlist stores to avoid side effects
vi.mock('../../store/cartStore', () => {
  const state = {
    addToCart: vi.fn(),
    getItemQuantity: vi.fn(() => 0),
    cart: { items: [], total: 0, count: 0 },
  };
  const useCartStore = (selector?: (s: typeof state) => unknown) =>
    selector ? (selector(state) as any) : (state as any);
  return { useCartStore };
});

vi.mock('../../store/wishlistStore', () => ({
  useWishlistStore: vi.fn(() => ({
    toggleItem: vi.fn(),
    isInWishlist: vi.fn(() => false),
  })),
}));

// Navigation state util mocked to no-return state
vi.mock('../../hooks/useNavigationState', () => ({
  useNavigationState: () => ({ getNavigationState: () => null, returnToStore: vi.fn() }),
}));

// Mock product store used by ProductPage (alias @/store/productStore)
vi.mock('@/store/productStore', () => {
  const state = {
    fetchProductById: async (id: string) =>
      id === 'p1'
        ? {
            id: 'p1',
            name: 'Producto Uno',
            description: 'Desc',
            price: 12,
            categories: ['c1'],
            images: [{ full: 'f.jpg', thumbnail: 't.jpg' }],
            stock: 10,
            sku: 'SKU1',
            tags: [],
          }
        : undefined,
  };
  const useProductStore = (selector?: (s: typeof state) => unknown) => (selector ? selector(state as any) : (state as any));
  return { useProductStore };
});

// También mockear el path relativo que algunos imports usan en tests
vi.mock('../../store/productStore', () => {
  const state = {
    fetchProductById: async (id: string) =>
      id === 'p1'
        ? {
            id: 'p1',
            name: 'Producto Uno',
            description: 'Desc',
            price: 12,
            categories: ['c1'],
            images: [{ full: 'f.jpg', thumbnail: 't.jpg' }],
            stock: 10,
            sku: 'SKU1',
            tags: [],
          }
        : undefined,
  };
  const useProductStore = (selector?: (s: typeof state) => unknown) => (selector ? selector(state as any) : (state as any));
  return { useProductStore };
});

// Mock productApi used by the real store implementation (fallback)
vi.mock('../../services/productApi', () => ({
  productApi: {
    fetchProductById: async (id: string) =>
      id === 'p1'
        ? {
            id: 'p1',
            name: 'Producto Uno',
            description: 'Desc',
            price: 12,
            compareAtPrice: null,
            stock: 10,
            category: 'c1',
            subcategory: null,
            categories: ['c1'],
            sku: 'SKU1',
            isFeatured: false,
            images: ['f.jpg'],
            benefits: [],
            benefitsDescription: [],
            ingredients: [],
            usage: null,
            dosage: null,
            administrationMethod: null,
            warnings: null,
            rating: 5,
            reviewCount: 0,
            detailedDescription: null,
            mechanismOfAction: null,
            healthIssues: [],
            components: [],
            faqs: [],
            scientificReferences: [],
            tags: [],
            priceNote: null,
            createdAt: new Date().toISOString(),
          }
        : null,
  },
}));

// Mock using alias resolver también (algunos imports usan '@/services/productApi')
vi.mock('@/services/productApi', () => ({
  productApi: {
    fetchProductById: async (id: string) =>
      id === 'p1'
        ? {
            id: 'p1',
            name: 'Producto Uno',
            description: 'Desc',
            price: 12,
            compareAtPrice: null,
            stock: 10,
            category: 'c1',
            subcategory: null,
            categories: ['c1'],
            sku: 'SKU1',
            isFeatured: false,
            images: ['f.jpg'],
            benefits: [],
            benefitsDescription: [],
            ingredients: [],
            usage: null,
            dosage: null,
            administrationMethod: null,
            warnings: null,
            rating: 5,
            reviewCount: 0,
            detailedDescription: null,
            mechanismOfAction: null,
            healthIssues: [],
            components: [],
            faqs: [],
            scientificReferences: [],
            tags: [],
            priceNote: null,
            createdAt: new Date().toISOString(),
          }
        : null,
  },
}));

describe('ProductPage', () => {
  beforeEach(() => {
    // jsdom doesn't implement scrollTo; mock to avoid errors from useScrollToTop
    (window as typeof window & { scrollTo: typeof vi.fn }).scrollTo = vi.fn();
  });
  const renderWithRoute = (initialEntries: string[]) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/tienda" element={<div>Tienda</div>} />
          <Route path="/producto/:productId" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    );

  it('redirects to /tienda when product not found', async () => {
    renderWithRoute(['/producto/unknown']);
    await waitFor(() => {
      expect(screen.getByText('Tienda')).toBeInTheDocument();
    });
  });

  it('renders product details when found', async () => {
    renderWithRoute(['/producto/p1']);
    const matches = await screen.findAllByText('Producto Uno');
    expect(matches.length).toBeGreaterThan(0);
  });
});
