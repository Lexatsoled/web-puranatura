import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import VirtualizedProductGrid from '../VirtualizedProductGrid';
import { Product } from '../../types/product';

const mockProductCard = vi.hoisted(() =>
  vi.fn(({ product }: { product: Product }) => (
    <div data-testid={`mock-product-card-${product.id}`}>{product.name}</div>
  ))
);

vi.mock('../ProductCard', () => ({
  __esModule: true,
  default: mockProductCard,
}));

vi.mock('react-virtuoso', () => ({
  VirtuosoGrid: ({ data = [], itemContent }: any) => (
    <div>
      {data.map((item: Product, index: number) => (
        <div key={item.id}>{itemContent(index, item)}</div>
      ))}
    </div>
  ),
  VirtuosoGridHandle: vi.fn(),
}));

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    price: 10,
    description: 'Description 1',
    stock: 100,
    sku: 'SKU1',
    tags: [],
    images: [],
    categories: [],
  },
  {
    id: '2',
    name: 'Product 2',
    price: 20,
    description: 'Description 2',
    stock: 200,
    sku: 'SKU2',
    tags: [],
    images: [],
    categories: [],
  },
  {
    id: '3',
    name: 'Product 3',
    price: 30,
    description: 'Description 3',
    stock: 300,
    sku: 'SKU3',
    tags: [],
    images: [],
    categories: [],
  },
];

describe('VirtualizedProductGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders visible product cards', () => {
    render(
      <BrowserRouter>
        <VirtualizedProductGrid
          products={mockProducts}
          containerWidth={800}
          containerHeight={600}
        />
      </BrowserRouter>
    );

    expect(screen.getByTestId('mock-product-card-1')).toBeInTheDocument();
    expect(mockProductCard).toHaveBeenCalled();
  });

  it('renders empty state when no products are provided', () => {
    render(
      <BrowserRouter>
        <VirtualizedProductGrid products={[]} containerWidth={800} containerHeight={600} />
      </BrowserRouter>
    );

    expect(
      screen.getByText('No se encontraron productos que coincidan con los filtros seleccionados.')
    ).toBeInTheDocument();
  });
});
