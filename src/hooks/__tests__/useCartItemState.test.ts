import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartItemState } from '../useCartItemState';
import { CartItem } from '../useShoppingCart';

describe('useCartItemState', () => {
  const mockItem: CartItem = {
    id: '1',
    name: 'Test Product',
    price: 100,
    quantity: 1,
    image: 'test.jpg',
    selectedVariantId: 'v1',
  };

  const handleQuantityChange = vi.fn();
  const handleVariantChange = vi.fn();

  it('should increment quantity', () => {
    const { result } = renderHook(() =>
      useCartItemState({
        item: mockItem,
        maxQuantityPerItem: 5,
        handleQuantityChange,
        handleVariantChange,
      })
    );

    act(() => {
      result.current.increment();
    });

    expect(handleQuantityChange).toHaveBeenCalledWith('1', 2);
  });

  it('should decrement quantity', () => {
    const { result } = renderHook(() =>
      useCartItemState({
        item: { ...mockItem, quantity: 2 },
        maxQuantityPerItem: 5,
        handleQuantityChange,
        handleVariantChange,
      })
    );

    act(() => {
      result.current.decrement();
    });

    expect(handleQuantityChange).toHaveBeenCalledWith('1', 1);
  });

  it('should indicate if max quantity is reached', () => {
    const { result } = renderHook(() =>
      useCartItemState({
        item: { ...mockItem, quantity: 5 },
        maxQuantityPerItem: 5,
        handleQuantityChange,
        handleVariantChange,
      })
    );

    expect(result.current.isMaxReached).toBe(true);
  });

  it('should handle variant change', () => {
    const { result } = renderHook(() =>
      useCartItemState({
        item: mockItem,
        maxQuantityPerItem: 5,
        handleQuantityChange,
        handleVariantChange,
      })
    );

    act(() => {
      result.current.selectVariant('v2');
    });

    expect(handleVariantChange).toHaveBeenCalledWith('1', 'v2');
  });
});
