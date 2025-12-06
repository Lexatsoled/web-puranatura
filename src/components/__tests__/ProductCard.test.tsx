import { describe, it, expect, vi } from 'vitest';
import { render } from '../../test/test-utils';
import * as testingLibrary from '@testing-library/react';
import ProductCard from '../ProductCard';

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
    const { getAllByText, getByRole, getByText } = render(
      <ProductCard product={mockProduct} onViewDetails={handleViewDetails} />
    );

    // Verificar que la información del producto se muestra correctamente
    expect(getAllByText(mockProduct.name)[0]).toBeInTheDocument();
    expect(
      getByRole('heading', { name: mockProduct.name })
    ).toBeInTheDocument();
    expect(
      getByText(`DOP $${mockProduct.price.toFixed(2)}`)
    ).toBeInTheDocument();
    expect(getByRole('button', { name: /añadir/i })).toBeInTheDocument();
  });

  it('calls onViewDetails when clicked', () => {
    const handleViewDetails = vi.fn();
    const { getAllByTestId } = render(
      <ProductCard product={mockProduct} onViewDetails={handleViewDetails} />
    );

    // Simular clic en el componente
    const cards = getAllByTestId('product-card-1');
    const cardToClick = cards.length > 1 ? cards[1] : cards[0];
    (testingLibrary as any).fireEvent.click(cardToClick);
    expect(handleViewDetails).toHaveBeenCalledWith(mockProduct);
  });

  it('displays the correct image', () => {
    const handleViewDetails = vi.fn();
    const { getAllByAltText } = render(
      <ProductCard product={mockProduct} onViewDetails={handleViewDetails} />
    );
    const image = getAllByAltText(mockProduct.name)[0];
    expect(image).toHaveAttribute('src', mockProduct.images[0].full);
  });

  it('renders correctly when images are missing (no crash)', () => {
    const handleViewDetails = vi.fn();
    const noImagesProduct = {
      ...mockProduct,
      id: '2',
      images: undefined as any,
    };

    const { getByRole, queryByAltText } = render(
      <ProductCard product={noImagesProduct} onViewDetails={handleViewDetails} />
    );

    // Product info should still render
    expect(getByRole('heading', { name: noImagesProduct.name })).toBeInTheDocument();

    // There should be no image rendered for the product name (image carousel is empty)
    expect(queryByAltText(noImagesProduct.name)).toBeNull();
  });
});
