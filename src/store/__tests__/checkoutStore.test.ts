import { describe, beforeEach, expect, it, vi } from 'vitest';
import { useCheckoutStore, type ShippingAddress, type PaymentMethod } from '../checkoutStore';
import type { Cart } from '../../types/cart';
import orderService from '../../services/orderService';
import { showSuccessNotification, showErrorNotification } from '../notificationStore';
import { errorLogger } from '../../services/errorLogger';

vi.mock('../../services/orderService', () => ({
  __esModule: true,
  default: {
    placeOrder: vi.fn(),
  },
}));

vi.mock('../notificationStore', () => ({
  showSuccessNotification: vi.fn(),
  showErrorNotification: vi.fn(),
}));

vi.mock('../../services/errorLogger', () => ({
  errorLogger: {
    log: vi.fn(),
  },
  ErrorSeverity: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
  },
  ErrorCategory: {
    NETWORK: 'network',
    RENDER: 'render',
    STATE: 'state',
    NAVIGATION: 'navigation',
    API: 'api',
    SECURITY: 'security',
    UNKNOWN: 'unknown',
  },
}));

const baseAddress: ShippingAddress = {
  id: 'addr-1',
  firstName: 'Ana',
  lastName: 'Pérez',
  company: 'Pureza',
  street: 'Calle 1',
  apartment: 'Apto 2',
  city: 'Santo Domingo',
  state: 'DN',
  postalCode: '10101',
  country: 'RD',
  phone: '+18095551234',
  isDefault: true,
};

const paymentMethod: PaymentMethod = {
  id: 'pay-1',
  type: 'credit_card',
  cardNumber: '4111111111111111',
  expiryDate: '12/27',
  cardHolder: 'Ana Pérez',
  isDefault: true,
};

const mockCart: Cart = {
  items: [
    {
      product: {
        id: '1',
        name: 'Producto A',
        description: 'Desc',
        price: 120,
        categories: ['general'],
        images: [{ full: '/img/a.jpg', thumbnail: '/img/a_thumb.jpg' }],
        stock: 10,
        sku: 'SKU-A',
        tags: [],
      } as any,
      quantity: 1,
    },
  ],
  total: 120,
  count: 1,
};

describe('checkoutStore.processOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    useCheckoutStore.setState((state) => ({
      ...state,
      shippingAddress: { ...baseAddress },
      paymentMethod: { ...paymentMethod },
      agreedToTerms: true,
      orderNotes: 'Llamar al llegar',
      orderSummary: {
        subtotal: mockCart.total,
        shipping: 150,
        tax: mockCart.total * 0.18,
        discount: 0,
        total: mockCart.total + 150 + mockCart.total * 0.18,
      },
    }));
  });

  it('envía el payload al OrderService y muestra notificación de éxito', async () => {
    const serviceMock = vi.mocked(orderService);
    serviceMock.placeOrder.mockResolvedValue({
      success: true,
      orderId: 'ORD-123',
    } as any);

    const result = await useCheckoutStore.getState().processOrder(mockCart);

    expect(serviceMock.placeOrder).toHaveBeenCalledTimes(1);
    const payload = serviceMock.placeOrder.mock.calls[0][0];
    expect(payload.items[0]).toMatchObject({
      productId: '1',
      productName: 'Producto A',
      quantity: 1,
    });
    expect(payload.shippingAddress.firstName).toBe('Ana');
    expect(payload.summary.total).toBeGreaterThan(mockCart.total);
    expect(result).toEqual({ success: true, orderId: 'ORD-123' });
    expect(showSuccessNotification).toHaveBeenCalledWith(
      expect.stringContaining('ORD-123'),
    );
  });

  it('persiste el pedido en localStorage cuando se completa con éxito', async () => {
    const serviceMock = vi.mocked(orderService);
    serviceMock.placeOrder.mockResolvedValue({
      success: true,
      orderId: 'ORD-456',
    } as any);

    expect(localStorage.getItem('pureza-naturalis-orders')).toBeNull();

    await useCheckoutStore.getState().processOrder(mockCart);

    const stored = JSON.parse(localStorage.getItem('pureza-naturalis-orders') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      id: 'ORD-456',
      status: 'confirmed',
      summary: expect.objectContaining({
        total: expect.any(Number),
      }),
    });
    expect(stored[0].items?.[0]).toMatchObject({
      product: expect.objectContaining({
        name: 'Producto A',
      }),
      quantity: 1,
    });
  });

  it('registra el error y notifica en caso de fallo', async () => {
    const serviceMock = vi.mocked(orderService);
    serviceMock.placeOrder.mockRejectedValue(new Error('API error'));

    const result = await useCheckoutStore.getState().processOrder(mockCart);

    expect(result.success).toBe(false);
    expect(showErrorNotification).toHaveBeenCalledWith('API error');
    expect(errorLogger.log).toHaveBeenCalled();
  });
});
