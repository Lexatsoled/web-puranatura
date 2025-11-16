import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/test-utils';
import ProductInfo from '../ProductInfo';
import { Product } from '../../types/product';
import { ProductService } from '../../services/ProductService';

vi.mock('../../services/productHelpers', () => ({
  formatPrice: vi.fn((price) => `${price.toFixed(2).replace('.', ',')} €`),
  calculateUnitPrice: vi.fn((product) => {
    if (product.priceNote && product.priceNote.length > 0) {
      const note = Array.isArray(product.priceNote) ? product.priceNote[0] : product.priceNote;
      const match = note.match(/(\d+(?:\.\d+)?)\s*RDS/i);
      if (match) return `${match[1].replace('.', ',')} €`;
    }
    return null;
  }),
  calculateDiscountedPrice: vi.fn((product) => {
    const originalPrice = product.price;
    const compareAtPrice = product.compareAtPrice;

    if (compareAtPrice && compareAtPrice > originalPrice) {
      const discountPercentage = Math.round(
        ((compareAtPrice - originalPrice) / compareAtPrice) * 100
      );
      return {
        originalPrice: compareAtPrice,
        finalPrice: originalPrice,
        discountPercentage,
        hasDiscount: true,
      };
    }
    return {
      originalPrice,
      finalPrice: originalPrice,
      discountPercentage: 0,
      hasDiscount: false,
    };
  }),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 29.99,
  categories: ['Test Category'],
  images: [],
  stock: 10,
  sku: 'TEST-001',
  tags: ['test'],
  rating: 4.5,
  reviewCount: 10,
  isNew: false,
  isBestSeller: false,
  compareAtPrice: 39.99,
  priceNote: ['125.00 RDS por cápsula'],
};

describe('ProductInfo Component', () => {
  it('renders product information correctly', () => {
    render(<ProductInfo product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('En stock')).toBeInTheDocument();
    expect(screen.getByText('29,99 €')).toBeInTheDocument();
    expect(screen.getByText('39,99 €')).toBeInTheDocument();
    expect(screen.getByText(/125,00 €/)).toBeInTheDocument();
  });

  it('handles products without categories gracefully', () => {
    const productWithoutCategories = { ...mockProduct, categories: [] };
    render(<ProductInfo product={productWithoutCategories} />);

    expect(screen.queryByText('Test Category')).not.toBeInTheDocument();
  });

  it('shows out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductInfo product={outOfStockProduct} />);

    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });
});
