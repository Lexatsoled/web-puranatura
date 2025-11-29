import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useShoppingCart from '../../src/hooks/useShoppingCart';

describe('useShoppingCart', () => {
  it('calculates subtotal, discount, tax and total correctly', () => {
    const items = [
      { id: '1', name: 'A', price: 10, quantity: 2, discount: 1 },
      { id: '2', name: 'B', price: 5, quantity: 1 },
    ];

    const { result } = renderHook(() =>
      useShoppingCart({
        items,
        taxRate: 0.1,
        shippingCost: 5,
        onUpdateQuantity: () => {},
      })
    );

    expect(result.current.subtotal).toBe(25); // 10*2 + 5*1
    expect(result.current.discount).toBe(2); // 1*2
    // taxable = 23, tax 10% = 2.3, total = 23 + 2.3 + 5 = 30.3
    expect(result.current.tax).toBeCloseTo(2.3);
    expect(result.current.total).toBeCloseTo(30.3);
    expect(result.current.totalItems).toBe(3);
  });

  it('handleQuantityChange clamps quantity and calls onUpdateQuantity', () => {
    const items = [
      { id: '1', name: 'A', price: 10, quantity: 2, maxQuantity: 3 },
    ];

    const onUpdateQuantity = vi.fn();

    const { result } = renderHook(() =>
      useShoppingCart({ items, onUpdateQuantity })
    );

    act(() => {
      result.current.handleQuantityChange('1', 10);
    });

    expect(onUpdateQuantity).toHaveBeenCalledWith('1', 3);

    act(() => {
      result.current.handleQuantityChange('1', 0);
    });

    expect(onUpdateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('handleVariantChange calls onUpdateVariant', () => {
    const items = [{ id: '1', name: 'A', price: 10, quantity: 2 }];

    const onUpdateQuantity = vi.fn();
    const onUpdateVariant = vi.fn();

    const { result } = renderHook(() =>
      useShoppingCart({ items, onUpdateQuantity, onUpdateVariant })
    );

    act(() => {
      result.current.handleVariantChange('1', 'v1');
    });

    expect(onUpdateVariant).toHaveBeenCalledWith('1', 'v1');
  });
});
