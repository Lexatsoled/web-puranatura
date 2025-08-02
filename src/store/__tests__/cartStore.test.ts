import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../cartStore';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  images: [{ full: 'test.jpg', thumbnail: 'test-thumb.jpg' }],
  description: 'Test Description',
  category: 'Test Category',
  stock: 10,
  sku: 'TEST-001',
  tags: ['test'],
};

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.setState({
      cart: {
        items: [],
        total: 0,
        count: 0,
      },
    });
  });

  it('should add an item to the cart', () => {
    const { addToCart } = useCartStore.getState();
    addToCart(mockProduct);

    const { cart } = useCartStore.getState();
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].product).toEqual(mockProduct);
    expect(cart.items[0].quantity).toBe(1);
    expect(cart.total).toBe(mockProduct.price);
    expect(cart.count).toBe(1);
  });

  it('should update quantity when adding the same product', () => {
    const { addToCart } = useCartStore.getState();
    addToCart(mockProduct);
    addToCart(mockProduct);

    const { cart } = useCartStore.getState();
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.total).toBe(mockProduct.price * 2);
    expect(cart.count).toBe(2);
  });

  it('should remove an item from the cart', () => {
    const { addToCart, removeFromCart } = useCartStore.getState();
    addToCart(mockProduct);
    removeFromCart(mockProduct.id);

    const { cart } = useCartStore.getState();
    expect(cart.items).toHaveLength(0);
    expect(cart.total).toBe(0);
    expect(cart.count).toBe(0);
  });

  it('should update item quantity', () => {
    const { addToCart, updateQuantity } = useCartStore.getState();
    addToCart(mockProduct);
    updateQuantity(mockProduct.id, 3);

    const { cart } = useCartStore.getState();
    expect(cart.items[0].quantity).toBe(3);
    expect(cart.total).toBe(mockProduct.price * 3);
    expect(cart.count).toBe(3);
  });

  it('should clear the cart', () => {
    const { addToCart, clearCart } = useCartStore.getState();
    addToCart(mockProduct);
    clearCart();

    const { cart } = useCartStore.getState();
    expect(cart.items).toHaveLength(0);
    expect(cart.total).toBe(0);
    expect(cart.count).toBe(0);
  });
});
