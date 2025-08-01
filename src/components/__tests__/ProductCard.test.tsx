import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import ProductCard from '../components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  category: 'Test Category',
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
    const handleViewDetails = vi.fn();
    render(
      <ProductCard product={mockProduct} onViewDetails={handleViewDetails} />
    );

    // Verificar que la información del producto se muestra correctamente
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText(`DOP $${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir/i })).toBeInTheDocument();
  });

  it('calls onViewDetails when clicked', () => {
    const handleViewDetails = vi.fn();
    render(
      <ProductCard product={mockProduct} onViewDetails={handleViewDetails} />
    );

    // Simular clic en el componente
    fireEvent.click(screen.getByText(mockProduct.name));
    expect(handleViewDetails).toHaveBeenCalledWith(mockProduct);
  });

  it('displays the correct image', () => {
    const handleViewDetails = vi.fn();
    render(
      <ProductCard product={mockProduct} onViewDetails={handleViewDetails} />
    );

    const image = screen.getByAltText(mockProduct.name);
    expect(image).toHaveAttribute('src', mockProduct.images[0].full);
  });
});
