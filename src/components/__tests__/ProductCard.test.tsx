import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import ProductCard from '../../../components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  categories: ['Test Category'],
  images: [
    {
      full: 'test-image-full.jpg',
      thumbnail: 'test-image-thumb.jpg',
    },
  ],
  stock: 10,
  sku: 'TEST-SKU-001',
  tags: ['test'],
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(
      <ProductCard product={mockProduct} />
    );

    // Verificar que la información del producto se muestra correctamente
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir/i })).toBeInTheDocument();
  });

  it('displays the product name as a link', () => {
    render(
      <ProductCard product={mockProduct} />
    );

    // Verificar que el nombre del producto es un enlace
    const nameLink = screen.getByRole('link', { name: mockProduct.name });
    expect(nameLink).toBeInTheDocument();
  });

  it('displays the correct image', () => {
    render(
      <ProductCard product={mockProduct} />
    );

    const image = screen.getByAltText(mockProduct.name);
    expect(image).toBeInTheDocument();
  });
});
