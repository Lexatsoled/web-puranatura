import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import StorePage from '../StorePage';
import { Product } from '@/types/product';

const mockProducts: Product[] = [
  { id: '1', name: 'Product A', description: 'Description A', price: 10, categories: ['category-1'], images: [], stock: 10, tags: [], isNew: false, isBestSeller: false },
  { id: '2', name: 'Product B', description: 'Description B', price: 20, categories: ['category-2'], images: [], stock: 5, tags: [], isNew: false, isBestSeller: false },
];

vi.mock('@/store/productStore', () => ({
  useProductStore: vi.fn((selector) => {
    const mockState = {
      products: mockProducts,
      loading: false,
      error: null,
      pagination: { page: 1, totalPages: 1 },
      fetchProducts: vi.fn(() => Promise.resolve(mockProducts))
    };
    return selector ? selector(mockState) : mockState;
  }),
}));

vi.mock('../../components/VirtualizedProductGrid', () => ({
  __esModule: true,
  default: vi.fn(({ products }) => (<div data-testid="virtualized-grid">{products.map((product: Product) => (<div key={product.id} data-testid={`product-card-${product.id}`}>{product.name}</div>))}</div>)),
}));

describe('StorePage', () => {
  const renderStorePage = () => render(<MemoryRouter><Routes><Route path="/" element={<StorePage />} /></Routes></MemoryRouter>);
  it('renders the StorePage title', () => { renderStorePage(); expect(screen.getByText('Tienda Natural')).toBeInTheDocument(); });
  it('displays products', async () => { renderStorePage(); await waitFor(() => { expect(screen.getByText('Product A')).toBeInTheDocument(); }); });
});
