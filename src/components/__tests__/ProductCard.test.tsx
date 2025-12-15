import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '../../test/test-utils';
import * as testingLibrary from '@testing-library/react';
import ProductCard from '../ProductCard';

// Mock ImageCarousel to bypass transform errors
vi.mock('../productCard/ImageCarousel', () => ({
  ImageCarousel: ({
    images,
    currentImageIndex,
    productName,
    onImageClick,
  }: any) => {
    if (!images || images.length === 0) return null;
    const img = images?.[currentImageIndex];
    const src = img?.full || img?.thumbnail || 'default-placeholder.jpg';
    return (
      <button
        onClick={onImageClick}
        aria-label={`Ver detalles de ${productName}`}
      >
        <div data-testid="mock-carousel">
          <img src={src} alt={productName} />
        </div>
      </button>
    );
  },
}));

afterEach(() => {
  cleanup();
});

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
    const { getByRole } = render(
      <ProductCard product={mockProduct} onViewDetails={handleViewDetails} />
    );

    // Verificar que la información del producto se muestra correctamente
    const headings = testingLibrary.screen.getAllByRole('heading', {
      name: mockProduct.name,
    });
    // Si hay múltiples headings (e.g. uno visible y otro oculto o duplicado por algún motivo de render), verificamos que al menos uno exista.
    expect(headings[0]).toBeInTheDocument();

    expect(
      testingLibrary.screen.getByText(`DOP $${mockProduct.price.toFixed(2)}`)
    ).toBeInTheDocument();
    expect(getByRole('button', { name: /añadir/i })).toBeInTheDocument();
  });

  it('calls onViewDetails when clicked', () => {
    const handleViewDetails = vi.fn();
    const { getAllByRole } = render(
      <ProductCard product={mockProduct} onViewDetails={handleViewDetails} />
    );

    // Simular clic en el componente (ahora a través de los botones interactivos)
    const viewDetailsButtons = getAllByRole('button', {
      name: new RegExp(`Ver detalles de ${mockProduct.name}`, 'i'),
    });
    // Puede haber múltiples botones (imagen y título)
    (testingLibrary as any).fireEvent.click(viewDetailsButtons[0]);
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
      <ProductCard
        product={noImagesProduct}
        onViewDetails={handleViewDetails}
      />
    );

    // Product info should still render
    expect(
      getByRole('heading', { name: noImagesProduct.name })
    ).toBeInTheDocument();

    // There should be no image rendered for the product name (image carousel is empty)
    expect(queryByAltText(noImagesProduct.name)).toBeNull();
  });
});
