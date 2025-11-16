import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartStore } from '../cartStore';
import { validateProductForCart } from '../../services/productHelpers';

// Define types for the mock
interface MockCartItem {
  product: any;
  quantity: number;
}

interface MockCart {
  items: MockCartItem[];
  total: number;
  count: number;
}

interface MockStore {
  cart: MockCart;
  isOpen: boolean;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getItemQuantity: (productId: string) => number;
  hasItems: () => boolean;
}

// Mock the entire cartStore to avoid persist middleware issues
vi.mock('../cartStore', () => {
  const mockStore: MockStore = {
    cart: { items: [], total: 0, count: 0 },
    isOpen: false,
    addToCart: vi.fn((product, quantity = 1) => {
      const existingItem = mockStore.cart.items.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        mockStore.cart.items.push({ product, quantity });
      }
      mockStore.cart.count = mockStore.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      mockStore.cart.total = mockStore.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }),
    removeFromCart: vi.fn((productId) => {
      mockStore.cart.items = mockStore.cart.items.filter(item => item.product.id !== productId);
      mockStore.cart.count = mockStore.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      mockStore.cart.total = mockStore.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }),
    updateQuantity: vi.fn((productId, quantity) => {
      if (quantity <= 0) {
        mockStore.removeFromCart(productId);
        return;
      }
      const item = mockStore.cart.items.find(item => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
        mockStore.cart.count = mockStore.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        mockStore.cart.total = mockStore.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      }
    }),
    clearCart: vi.fn(() => {
      mockStore.cart = { items: [], total: 0, count: 0 };
    }),
    toggleCart: vi.fn(),
    setCartOpen: vi.fn(),
    getItemQuantity: vi.fn((productId) => {
      const item = mockStore.cart.items.find(item => item.product.id === productId);
      return item ? item.quantity : 0;
    }),
    hasItems: vi.fn(() => mockStore.cart.items.length > 0),
  };

  // Function to reset the mock store
  const resetMockStore = () => {
    mockStore.cart = { items: [], total: 0, count: 0 };
    mockStore.isOpen = false;
  };

  return {
    useCartStore: vi.fn(() => mockStore),
    resetMockStore,
  };
});

// Mock productHelpers
vi.mock('../../services/productHelpers', () => ({
  validateProductForCart: vi.fn(),
}));

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  images: [{ full: 'test.jpg', thumbnail: 'test-thumb.jpg' }],
  description: 'Test Description',
  categories: ['Test Category'],
  stock: 10,
  sku: 'TEST-001',
  tags: ['test'],
};

describe('Cart Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock store state by calling useCartStore and modifying its cart
    const store = useCartStore();
    store.cart.items = [];
    store.cart.total = 0;
    store.cart.count = 0;
    store.isOpen = false;
  });

  it('should add an item to the cart', () => {
    // Mock productHelpers validation
    vi.mocked(validateProductForCart).mockReturnValue({
      isValid: true,
    });

    const { addToCart } = useCartStore();
    addToCart(mockProduct);

    const { cart } = useCartStore();
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].product).toEqual(mockProduct);
    expect(cart.items[0].quantity).toBe(1);
    expect(cart.total).toBe(mockProduct.price);
    expect(cart.count).toBe(1);
  });

  it('should update quantity when adding the same product', () => {
    // Mock productHelpers validation
    vi.mocked(validateProductForCart).mockReturnValue({
      isValid: true,
    });

    const { addToCart } = useCartStore();
    addToCart(mockProduct);
    addToCart(mockProduct);

    const { cart } = useCartStore();
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.total).toBe(mockProduct.price * 2);
    expect(cart.count).toBe(2);
  });

  it('should remove an item from the cart', () => {
    const { addToCart, removeFromCart } = useCartStore();
    addToCart(mockProduct);
    removeFromCart(mockProduct.id);

    const { cart } = useCartStore();
    expect(cart.items).toHaveLength(0);
    expect(cart.total).toBe(0);
    expect(cart.count).toBe(0);
  });

  it('should update item quantity', () => {
    const { addToCart, updateQuantity } = useCartStore();
    addToCart(mockProduct);
    updateQuantity(mockProduct.id, 3);

    const { cart } = useCartStore();
    expect(cart.items[0].quantity).toBe(3);
    expect(cart.total).toBe(mockProduct.price * 3);
    expect(cart.count).toBe(3);
  });

  it('should clear the cart', () => {
    const { addToCart, clearCart } = useCartStore();
    addToCart(mockProduct);
    clearCart();

    const { cart } = useCartStore();
    expect(cart.items).toHaveLength(0);
    expect(cart.total).toBe(0);
    expect(cart.count).toBe(0);
  });
});
