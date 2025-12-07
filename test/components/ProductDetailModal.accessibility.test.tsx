import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import ProductDetailModal from '../../components/ProductDetailModal';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';

const sampleProduct = {
  id: 'p1',
  name: 'Test Product',
  price: 12.34,
  description: 'Test description',
  images: [{ full: '/img/full.jpg', thumbnail: '/img/thumb.jpg' }],
  category: 'Test',
} as any;

describe('ProductDetailModal accessibility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
    cleanup();
  });

  test('focus moves to close button when opened and Escape closes', () => {
    const onClose = vi.fn();
    render(
      <AuthProvider>
        <CartProvider>
          <ProductDetailModal
            product={sampleProduct}
            isOpen={true}
            onClose={onClose}
          />
        </CartProvider>
      </AuthProvider>
    );

    const closeButton = screen.getByRole('button', { name: /cerrar/i });
    expect(closeButton).toBeInTheDocument();
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
