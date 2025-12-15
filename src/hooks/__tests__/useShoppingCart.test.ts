import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useShoppingCart } from '../useShoppingCart';
import { CartItem } from '../cart/types';

describe('useShoppingCart', () => {
  const mockItems: CartItem[] = [
    {
      id: '1',
      name: 'Item 1',
      price: 100,
      quantity: 2,
      selectedVariantId: 'v1',
      image: 'img1.jpg',
    },
    {
      id: '2',
      name: 'Item 2',
      price: 50,
      quantity: 1,
      selectedVariantId: 'v2',
      image: 'img2.jpg',
    },
  ];

  const onUpdateQuantity = vi.fn();
  const onUpdateVariant = vi.fn();

  it('should calculate totals correctly', () => {
    const { result } = renderHook(() =>
      useShoppingCart({
        items: mockItems,
        taxRate: 0.1,
        shippingCost: 20,
        onUpdateQuantity,
        onUpdateVariant,
      })
    );

    // Subtotal: (100 * 2) + (50 * 1) = 250
    expect(result.current.subtotal).toBe(250);
    // Tax: 250 * 0.1 = 25
    expect(result.current.tax).toBe(25);
    // Shipping implicitly in total
    // Total: 250 + 25 + 20 = 295
    expect(result.current.total).toBe(295);
  });

  it('should handle empty cart', () => {
    const { result } = renderHook(() =>
      useShoppingCart({
        items: [],
        taxRate: 0.1,
        shippingCost: 20,
        onUpdateQuantity,
        onUpdateVariant,
      })
    );

    expect(result.current.subtotal).toBe(0);
    // With current logic, shipping is added even if empty
    expect(result.current.total).toBe(20);
  });

  it('should delegate update quantity', () => {
    const { result } = renderHook(() =>
      useShoppingCart({
        items: mockItems,
        onUpdateQuantity,
        onUpdateVariant,
      })
    );

    act(() => {
      result.current.handleQuantityChange('1', 3);
    });

    expect(onUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });
});
