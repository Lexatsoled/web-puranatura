import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import ProductCard from '../ProductCard';
import { Product } from '../../types/product';
import '@testing-library/jest-dom';
import { includesText } from '../../test/utils/text';

// Import the mocked module for testing
import * as cartStoreModule from '../../store/cartStore';

vi.mock('../../services/ProductService', () => ({
  ProductService: {
    formatPrice: vi.fn((price) => `${price.toFixed(2)} RDS`),
    calculateUnitPrice: vi.fn((product) => {
      if (product.priceNote && product.priceNote.length > 0) {
        const note = Array.isArray(product.priceNote) ? product.priceNote[0] : product.priceNote;
        const match = note.match(/(\d+(?:\.\d+)?)\s*RDS/i);
        if (match) return `${match[1]} RDS`;
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
    validateProductForCart: vi.fn(() => ({ valid: true })),
  },
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  categories: ['Test Category'],
  images: [
    {
      full: 'test-image-full.jpg',
      thumbnail: 'test-image-thumb.jpg',
      alt: 'Test Product',
    },
  ],
  stock: 10,
  sku: 'TEST-SKU-001',
  tags: ['test'],
};

vi.mock('../../store/cartStore', () => ({
  useCartStore: vi.fn(() => ({
    addToCart: vi.fn(),
    getItemQuantity: vi.fn(() => 0),
    cart: { items: [], total: 0, count: 0 },
    isOpen: false,
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    toggleCart: vi.fn(),
    setCartOpen: vi.fn(),
    hasItems: vi.fn(() => false),
  })),
}));

vi.mock('../../store/wishlistStore', () => ({
  useWishlistStore: vi.fn(() => ({
    toggleItem: vi.fn(),
    isInWishlist: vi.fn(() => false),
  })),
}));

describe('ProductCard', () => {
  it('calls addToCart when "Add to Cart" button is clicked', () => {
    // Access the mocked useCartStore function
    const mockUseCartStore = vi.mocked(cartStoreModule.useCartStore);

    // Create a mock addToCart function
    const mockAddToCart = vi.fn();

    // Override the mock for this specific test
    mockUseCartStore.mockReturnValueOnce({
      addToCart: mockAddToCart,
      getItemQuantity: vi.fn(() => 0),
      cart: { items: [], total: 0, count: 0 },
      isOpen: false,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      toggleCart: vi.fn(),
      setCartOpen: vi.fn(),
      hasItems: vi.fn(() => false),
    });

    render(<ProductCard product={mockProduct} />);

    const addToCartButton = screen.getByRole('button', { name: includesText('Añadir') });
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

  // Check for product name, price (tolerant to localization/currency), and add to cart button
  expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  // Price formatting can vary (99.99 RDS vs 99,99 €) — match the numeric amount loosely
  expect(screen.getByText(/99(?:[.,]99)/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: includesText('Añadir') })).toBeInTheDocument();
  });

  it('displays the product name as a link', () => {
    render(<ProductCard product={mockProduct} />);

    // Use a more specific query to get the link by its role and name
    const nameLinks = screen.getAllByRole('link', { name: mockProduct.name });
    expect(nameLinks.length).toBeGreaterThan(0);
  const nameLink = nameLinks[0]; // Get the first one
  // href may include a base path (e.g. /tienda/producto/1) — assert it ends with the product path
  const href = nameLink.getAttribute('href') || '';
  expect(href.endsWith(`/producto/${mockProduct.id}`)).toBe(true);
  });

  it('displays the correct image', () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText(mockProduct.images[0].alt || 'Test Product');
    expect(image).toBeInTheDocument();
    // Accept src with or without leading slash
    const src = image.getAttribute('src') || '';
    expect(src.endsWith(mockProduct.images[0].full)).toBe(true);
  });
});

