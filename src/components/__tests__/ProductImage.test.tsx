import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import ProductImage from '../ProductImage';
import { Product } from '../../types/product';

// Mock de OptimizedImage
vi.mock('../OptimizedImage', () => ({
  default: ({ src, alt, className, onClick }: { src: string; alt: string; className?: string; onClick?: () => void }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      data-testid="optimized-image"
    />
  ),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  description: 'Test description',
  categories: ['Test Category'],
  images: [
    {
      full: '/test-image.jpg',
      thumbnail: '/test-image-thumb.jpg',
      alt: 'Test Product',
    },
  ],
  stock: 10,
  sku: 'TEST-001',
  tags: ['tag1'],
  rating: 4.5,
  reviewCount: 10,
  isNew: false,
  isBestSeller: false,
  compareAtPrice: 39.99,
};

const mockOutOfStockProduct: Product = {
  ...mockProduct,
  stock: 0,
};

describe('ProductImage Component', () => {
  it('renders product image with correct attributes', () => {
    render(<ProductImage product={mockProduct} />);

    const image = screen.getByTestId('optimized-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Product');
  });

  it('renders link with correct href', () => {
    render(<ProductImage product={mockProduct} />);

  const link = screen.getByRole('link');
  const href = link.getAttribute('href') || '';
  expect(href.endsWith('/producto/1')).toBe(true);
  });

  it('applies out of stock styling when product is out of stock', () => {
    render(<ProductImage product={mockOutOfStockProduct} />);

    const image = screen.getByTestId('optimized-image');
    expect(image).toHaveClass('opacity-50');
    expect(image).toHaveClass('grayscale');
  });

  it('applies hover effects when product is in stock', () => {
    render(<ProductImage product={mockProduct} />);

    const image = screen.getByTestId('optimized-image');
    expect(image).toHaveClass('group-hover:scale-110');
    expect(image).toHaveClass('group-hover:-rotate-1');
  });

  it('handles string image format correctly', () => {
    const productWithStringImage: Product = {
      ...mockProduct,
      images: ['/string-image.jpg' as any],
    };

    render(<ProductImage product={productWithStringImage} />);

    const image = screen.getByTestId('optimized-image');
    expect(image).toHaveAttribute('src', '/string-image.jpg');
  });

  it('calls onProductClick when provided and link is clicked', () => {
    const mockOnClick = vi.fn();
    render(<ProductImage product={mockProduct} onProductClick={mockOnClick} />);

    const link = screen.getByRole('link');
    link.click();

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-test-class';
    render(<ProductImage product={mockProduct} className={customClass} />);

    const container = screen.getByRole('link');
    expect(container).toHaveClass(customClass);
  });

  it('has correct container styling', () => {
    render(<ProductImage product={mockProduct} />);

    const container = screen.getByRole('link');
    expect(container).toHaveClass('relative');
    expect(container).toHaveClass('aspect-ratio-1-1');
    expect(container).toHaveClass('bg-gradient-to-br');
    expect(container).toHaveClass('cursor-pointer');
  });

  it('renders overlay with correct opacity for in stock products', () => {
    render(<ProductImage product={mockProduct} />);

    // The overlay div should exist and have group-hover opacity
    const overlay =
      screen.getByTestId('optimized-image').parentElement?.nextElementSibling;
    expect(overlay).toHaveClass('bg-black');
    expect(overlay).toHaveClass('bg-opacity-0');
    expect(overlay).toHaveClass('group-hover:bg-opacity-5');
  });

  it('renders overlay with different opacity for out of stock products', () => {
    render(<ProductImage product={mockOutOfStockProduct} />);

    const overlay =
      screen.getByTestId('optimized-image').parentElement?.nextElementSibling;
    expect(overlay).toHaveClass('bg-black');
    expect(overlay).toHaveClass('bg-opacity-20');
  });
});
