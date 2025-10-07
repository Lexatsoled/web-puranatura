import { create } from 'zustand';
import { Cart } from '../types/cart';
import { showSuccessNotification, showErrorNotification } from './notificationStore';

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
  processOrder: (cart: Cart) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  resetCheckout: () => void;
  
  // Validation
  isStepValid: (step: number) => boolean;
  canProceedToNextStep: () => boolean;
}

const SHIPPING_RATE = 150; // DOP
const TAX_RATE = 0.18; // 18% ITBIS

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Validate required fields
      const { shippingAddress, paymentMethod, agreedToTerms } = get();
      
      if (!shippingAddress) {
        throw new Error('Dirección de envío requerida');
      }
      
      if (!paymentMethod) {
        throw new Error('Método de pago requerido');
      }
      
      if (!agreedToTerms) {
        throw new Error('Debe aceptar los términos y condiciones');
      }

      if (cart.items.length === 0) {
        throw new Error('El carrito está vacío');
      }

      // Generate order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Save order to localStorage (simulate database)
      const order = {
        id: orderId,
        date: new Date().toISOString(),
        items: cart.items,
        shippingAddress,
        paymentMethod,
        orderNotes: get().orderNotes,
        summary: get().orderSummary,
        status: 'pending',
      };

      const existingOrders = JSON.parse(localStorage.getItem('pureza-naturalis-orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('pureza-naturalis-orders', JSON.stringify(existingOrders));

      showSuccessNotification(`¡Pedido #${orderId} realizado con éxito!`);

      set({ isProcessing: false });
      return { success: true, orderId };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pedido';
      showErrorNotification(errorMessage);
      set({ isProcessing: false });
      return { success: false, error: errorMessage };
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
