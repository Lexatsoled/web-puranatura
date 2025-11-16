import { create } from 'zustand';
import { Cart } from '../types/cart';
import { showSuccessNotification, showErrorNotification } from './notificationStore';
import orderService, { type CreateOrderData } from '../services/orderService';
import { errorLogger, ErrorSeverity, ErrorCategory } from '../services/errorLogger';

export interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash_on_delivery';
  cardNumber?: string;
  expiryDate?: string;
  cardHolder?: string;
  bankName?: string;
  accountNumber?: string;
  isDefault: boolean;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

interface CheckoutStore {
  // State
  currentStep: number;
  isProcessing: boolean;
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod | null;
  orderNotes: string;
  agreedToTerms: boolean;
  orderSummary: OrderSummary;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setOrderNotes: (notes: string) => void;
  setAgreedToTerms: (agreed: boolean) => void;
  calculateOrderSummary: (cart: Cart) => void;
  processOrder: (
    cart: Cart
  ) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  resetCheckout: () => void;

  // Validation
  isStepValid: (step: number) => boolean;
  canProceedToNextStep: () => boolean;
}

const SHIPPING_RATE = 150; // DOP
const TAX_RATE = 0.18; // 18% ITBIS
const ORDERS_STORAGE_KEY = 'pureza-naturalis-orders';

const safeParseJSON = (value: string | null) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const persistOrderRecord = (
  orderId: string,
  cart: Cart,
  shippingAddress: ShippingAddress,
  paymentMethod: PaymentMethod,
  orderNotes: string,
  orderSummary: OrderSummary,
) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const normalizedItems = cart.items.map((item) => {
      const images =
        Array.isArray(item.product.images) && item.product.images.length > 0
          ? item.product.images.map((img) => ({
              full: img.full ?? img.thumbnail ?? '/placeholder-product.jpg',
              thumbnail: img.thumbnail,
              alt: img.alt,
            }))
          : [{ full: '/placeholder-product.jpg' }];

      return {
        product: {
          name: item.product.name,
          price: item.product.price,
          images,
        },
        quantity: item.quantity,
      };
    });

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      items: normalizedItems,
      shippingAddress,
      paymentMethod: {
        type: paymentMethod.type,
      },
      orderNotes: orderNotes?.trim() ?? '',
      summary: {
        subtotal: orderSummary.subtotal,
        shipping: orderSummary.shipping,
        tax: orderSummary.tax,
        discount: orderSummary.discount,
        total: orderSummary.total,
      },
      status: 'confirmed',
    };

    const existingOrders = safeParseJSON(localStorage.getItem(ORDERS_STORAGE_KEY));
    const orders = Array.isArray(existingOrders) ? existingOrders : [];
    orders.push(newOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    errorLogger.log(err instanceof Error ? err : new Error('Failed to persist order'), ErrorSeverity.LOW, ErrorCategory.STATE, {
      scope: 'checkout.persistOrderRecord',
    });
  }
};

const mapCartToOrderPayload = (
  cart: Cart,
  shippingAddress: ShippingAddress,
  paymentMethod: PaymentMethod,
  orderNotes: string,
  orderSummary: OrderSummary,
): CreateOrderData => ({
  items: cart.items.map((item) => ({
    productId: String(item.product.id),
    productName: item.product.name,
    productImage: item.product.images?.[0]?.full,
    variantId: item.product.sku,
    variantName: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  })),
  shippingAddress: {
    firstName: shippingAddress.firstName,
    lastName: shippingAddress.lastName,
    company: shippingAddress.company,
    street: shippingAddress.street,
    apartment: shippingAddress.apartment,
    city: shippingAddress.city,
    state: shippingAddress.state,
    postalCode: shippingAddress.postalCode,
    country: shippingAddress.country,
    phone: shippingAddress.phone,
  },
  paymentMethod: {
    type: paymentMethod.type,
  },
  orderNotes: orderNotes?.trim() || undefined,
  summary: {
    subtotal: orderSummary.subtotal,
    shipping: orderSummary.shipping,
    tax: orderSummary.tax,
    discount: orderSummary.discount ?? 0,
    total: orderSummary.total,
  },
});

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  // Initial state
  currentStep: 1,
  isProcessing: false,
  shippingAddress: null,
  paymentMethod: null,
  orderNotes: '',
  agreedToTerms: false,
  orderSummary: {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
  },

  // Step navigation
  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const currentStep = get().currentStep;
    if (get().canProceedToNextStep() && currentStep < 4) {
      set({ currentStep: currentStep + 1 });
    }
  },

  previousStep: () => {
    const currentStep = get().currentStep;
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  // Data setters
  setShippingAddress: (address) => set({ shippingAddress: address }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setOrderNotes: (notes) => set({ orderNotes: notes }),
  setAgreedToTerms: (agreed) => set({ agreedToTerms: agreed }),

  // Order calculation
  calculateOrderSummary: (cart) => {
    const subtotal = cart.total;
    const shipping = subtotal > 3000 ? 0 : SHIPPING_RATE; // Free shipping over DOP 3000
    const tax = subtotal * TAX_RATE;
    const discount = 0; // TODO: Implement discount logic
    const total = subtotal + shipping + tax - discount;

    set({
      orderSummary: {
        subtotal,
        shipping,
        tax,
        discount,
        total,
      },
    });
  },

  // Order processing
  processOrder: async (cart) => {
    set({ isProcessing: true });
    try {
      const { shippingAddress, paymentMethod, agreedToTerms, orderNotes, orderSummary } = get();
      if (!shippingAddress) throw new Error('Dirección de envío requerida');
      if (!paymentMethod) throw new Error('Método de pago requerido');
      if (!agreedToTerms) throw new Error('Debe aceptar los términos y condiciones');
      if (cart.items.length === 0) throw new Error('El carrito está vacío');

      const payload = mapCartToOrderPayload(cart, shippingAddress, paymentMethod, orderNotes, orderSummary);

      const response = await orderService.placeOrder(payload);
      persistOrderRecord(response.orderId, cart, shippingAddress, paymentMethod, orderNotes, orderSummary);
      showSuccessNotification(`¡Pedido #${response.orderId} realizado con éxito!`);
      return { success: true, orderId: response.orderId };
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error('Error al procesar el pedido');
      showErrorNotification(normalizedError.message);
      errorLogger.log(normalizedError, ErrorSeverity.HIGH, ErrorCategory.API, {
        scope: 'checkout.processOrder',
      });
      return { success: false, error: normalizedError.message };
    } finally {
      set({ isProcessing: false });
    }
  },

  // Reset checkout
  resetCheckout: () =>
    set({
      currentStep: 1,
      isProcessing: false,
      shippingAddress: null,
      paymentMethod: null,
      orderNotes: '',
      agreedToTerms: false,
      orderSummary: {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0,
      },
    }),

  // Validation
  isStepValid: (step) => {
    const state = get();

    switch (step) {
      case 1: // Shipping
        return !!state.shippingAddress;
      case 2: // Payment
        return !!state.paymentMethod;
      case 3: // Review
        return !!state.shippingAddress && !!state.paymentMethod;
      case 4: // Confirmation
        return state.agreedToTerms;
      default:
        return false;
    }
  },

  canProceedToNextStep: () => {
    const currentStep = get().currentStep;
    return get().isStepValid(currentStep);
  },
}));

