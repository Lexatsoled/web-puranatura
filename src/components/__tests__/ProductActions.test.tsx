import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import ProductActions from '../ProductActions';
import { Product } from '../../types/product';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { ProductService } from '../../services/ProductService';
import { includesText } from '../../test/utils/text';

// Hoist mocks to the top
const mockAddToCart = vi.fn();
const mockGetItemQuantity = vi.fn();
const mockToggleItem = vi.fn();
const mockIsInWishlist = vi.fn();

vi.mock('../../store/cartStore', () => ({
  useCartStore: vi.fn(() => ({
    addToCart: mockAddToCart,
    getItemQuantity: mockGetItemQuantity,
  })),
}));

vi.mock('../../store/wishlistStore', () => ({
  useWishlistStore: vi.fn(() => ({
    toggleItem: mockToggleItem,
    isInWishlist: mockIsInWishlist,
  })),
}));

vi.mock('../../services/ProductService');

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
  tags: [],
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

describe('ProductActions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Safe mocks: ensure functions exist before accessing mock helpers
    const cart = useCartStore();
    if (cart && cart.getItemQuantity && 'mockReturnValue' in cart.getItemQuantity) {
      vi.mocked(cart.getItemQuantity as any).mockReturnValue(0);
    }
    const wish = useWishlistStore();
    if (wish && wish.isInWishlist && 'mockReturnValue' in wish.isInWishlist) {
      vi.mocked(wish.isInWishlist as any).mockReturnValue(false);
    }
    try {
      if (ProductService && (ProductService as any).validateProductForCart) {
        vi.mocked((ProductService as any).validateProductForCart as any).mockReturnValue({ valid: true });
      }
    } catch (e) {
      // if ProductService mock isn't a jest mock, skip; individual tests may override
    }
  });

  it('renders add to cart button for in stock products', () => {
    render(<ProductActions product={mockProduct} />);
    const addButton = screen.getByRole('button', { name: /Añadir|products\.addToCart/i });
    expect(addButton).toBeInTheDocument();
    expect(addButton).not.toBeDisabled();
  });

  it('disables add to cart button for out of stock products', async () => {
    render(<ProductActions product={mockOutOfStockProduct} />);
    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: /agotado|products\.outOfStock/i });
      expect(addButton).toBeInTheDocument();
      expect(addButton).toBeDisabled();
    });
  });

  it('shows out of stock badge for out of stock products', () => {
    render(<ProductActions product={mockOutOfStockProduct} />);
    const badges = screen.getAllByText(/Agotado|products\.outOfStock/i);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('calls addToCart with correct parameters when add button is clicked', () => {
    render(<ProductActions product={mockProduct} />);
    const addButton = screen.getByRole('button', { name: includesText('Añadir') });
    fireEvent.click(addButton);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('shows wishlist button and handles toggle', () => {
    render(<ProductActions product={mockProduct} />);
    const wishlistButton = screen.getByRole('button', {
      name: /lista de deseos|lista de deseos/i,
    });
    expect(wishlistButton).toBeInTheDocument();
    fireEvent.click(wishlistButton);
    expect(mockToggleItem).toHaveBeenCalledWith(mockProduct);
  });

  it('shows different wishlist button styles based on wishlist status', async () => {
    vi.mocked(useWishlistStore().isInWishlist).mockReturnValue(true);
    render(<ProductActions product={mockProduct} />);
    await waitFor(() => {
      const wishlistButton = screen.getByRole('button', {
        name: /lista de deseos/i,
      });
      expect(wishlistButton).toHaveClass('bg-red-500');
    });
  });

  it('shows cart quantity badge when item is in cart', async () => {
    vi.mocked(useCartStore().getItemQuantity).mockReturnValue(3);
    render(<ProductActions product={mockProduct} />);
    await waitFor(() => {
      // Quantity badge is localized; match number + carrito word loosely
      expect(screen.getByText(/3.*carrito/i)).toBeInTheDocument();
    });
  });
});

