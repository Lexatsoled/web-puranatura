import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CheckoutPage from '../CheckoutPage';
import { AuthProvider } from '../../contexts/AuthContext';
import { includesText } from '../../test/utils/text';
import * as authStoreModule from '../../store/authStore';
import * as cartStoreModule from '../../store/cartStore';
import * as checkoutStoreModule from '../../store/checkoutStore';
import * as addressServiceModule from '../../services/addressService';
import * as orderServiceModule from '../../services/orderService';

// Mock the authStore
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    isAuthenticated: false,
    user: null,
  })),
}));

// Mock the cartStore
vi.mock('../../store/cartStore', () => ({
  useCartStore: vi.fn(() => ({
    cart: { items: [], total: 0, count: 0 },
    clearCart: vi.fn(),
  })),
}));

// Mock the checkoutStore
vi.mock('../../store/checkoutStore', () => ({
  useCheckoutStore: vi.fn(() => ({
    currentStep: 1,
    orderSummary: { subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 },
    calculateOrderSummary: vi.fn(),
    nextStep: vi.fn(),
    previousStep: vi.fn(),
    setPaymentMethod: vi.fn(),
    processOrder: vi.fn(),
  })),
}));

// Mock the addressService
vi.mock('../../services/addressService', () => ({
  AddressService: {
    getAddresses: vi.fn(),
  },
}));

// Mock the orderService
vi.mock('../../services/orderService', () => ({
  OrderService: {
    getInstance: vi.fn(() => ({
      placeOrder: vi.fn(),
    })),
  },
}));

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    // Reset localStorage mock
    vi.mocked(localStorageMock.getItem).mockReturnValue(null);
    // Reset authStore mock
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    // Reset cartStore mock
    vi.mocked(cartStoreModule.useCartStore).mockReturnValue({
      cart: { items: [], total: 0, count: 0 },
      clearCart: vi.fn(),
    });
    // Reset checkoutStore mock
    vi.mocked(checkoutStoreModule.useCheckoutStore).mockReturnValue({
      currentStep: 1,
      orderSummary: { subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 },
      calculateOrderSummary: vi.fn(),
      nextStep: vi.fn(),
      previousStep: vi.fn(),
      setPaymentMethod: vi.fn(),
      processOrder: vi.fn(),
    });
    // Reset addressService mock
    vi.mocked(addressServiceModule.AddressService.getAddresses).mockResolvedValue([]);
    // Reset orderService mock
    const mockOrderService = vi.mocked(orderServiceModule.OrderService.getInstance());
    mockOrderService.placeOrder.mockResolvedValue({ orderId: '123', status: 'confirmed', message: 'Order placed successfully' });
  });

  const renderCheckoutPage = (initialEntries = ['/checkout']) => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/tienda" element={<div>Tienda Page</div>} />
            <Route path="/pedido-confirmado/:orderId" element={<div>Pedido Confirmado Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
  };

  it('redirects to store if cart is empty', () => {
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    renderCheckoutPage();
    expect(screen.getByText('Tienda Page')).toBeInTheDocument();
  });

  it('renders order summary when authenticated and cart is not empty', async () => {
    const mockCartItems = [
      { product: { id: '1', name: 'Product A', price: 10, images: [{ full: 'image1.jpg', thumbnail: 'thumb1.jpg' }] }, quantity: 2 },
      { product: { id: '2', name: 'Product B', price: 20, images: [{ full: 'image2.jpg', thumbnail: 'thumb2.jpg' }] }, quantity: 1 },
    ];
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    vi.mocked(cartStoreModule.useCartStore).mockReturnValue({
      cart: { items: mockCartItems, total: 40, count: 3 },
      clearCart: vi.fn(),
    });
    vi.mocked(checkoutStoreModule.useCheckoutStore).mockReturnValue({
      currentStep: 1,
      orderSummary: { subtotal: 40, shipping: 150, tax: 7.2, discount: 0, total: 197.2 },
      calculateOrderSummary: vi.fn(),
      nextStep: vi.fn(),
      previousStep: vi.fn(),
      setPaymentMethod: vi.fn(),
      processOrder: vi.fn(),
    });
    renderCheckoutPage();

    await waitFor(() => {
      expect(screen.getByText(includesText('Resumen del Pedido'))).toBeInTheDocument();
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
      expect(screen.getByText('DOP $197.20')).toBeInTheDocument();
    });
  });

  it('shows free shipping banner when subtotal below threshold', async () => {
    const mockCartItems = [
      { product: { id: '1', name: 'Product A', price: 10, images: [{ full: 'image1.jpg', thumbnail: 'thumb1.jpg' }] }, quantity: 1 },
    ];
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    vi.mocked(cartStoreModule.useCartStore).mockReturnValue({
      cart: { items: mockCartItems, total: 10, count: 1 },
      clearCart: vi.fn(),
    });
    vi.mocked(checkoutStoreModule.useCheckoutStore).mockReturnValue({
      currentStep: 1,
      orderSummary: { subtotal: 10, shipping: 150, tax: 1.8, discount: 0, total: 161.8 },
      calculateOrderSummary: vi.fn(),
      nextStep: vi.fn(),
      previousStep: vi.fn(),
      setPaymentMethod: vi.fn(),
      processOrder: vi.fn(),
    });

    renderCheckoutPage();

    await waitFor(() => {
      expect(
        screen.getByText((t) => !!t && t.includes('para envío gratis'))
      ).toBeInTheDocument();
    });
  });

  it('allows placing an order', async () => {
    const mockCartItems = [
      { product: { id: '1', name: 'Product A', price: 10, images: [{ full: 'image1.jpg', thumbnail: 'thumb1.jpg' }] }, quantity: 2 },
    ];
    const mockPlaceOrder = vi.fn().mockResolvedValue({ orderId: '123', status: 'confirmed', message: 'Order placed successfully' });
    const mockProcessOrder = vi.fn().mockResolvedValue({ success: true, orderId: '123' });
    vi.mocked(authStoreModule.useAuthStore).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
    });
    vi.mocked(cartStoreModule.useCartStore).mockReturnValue({
      cart: { items: mockCartItems, total: 20, count: 2 },
      clearCart: vi.fn(),
    });
    vi.mocked(checkoutStoreModule.useCheckoutStore).mockReturnValue({
      currentStep: 4,
      orderSummary: { subtotal: 20, shipping: 150, tax: 3.6, discount: 0, total: 173.6 },
      calculateOrderSummary: vi.fn(),
      nextStep: vi.fn(),
      previousStep: vi.fn(),
      setPaymentMethod: vi.fn(),
      processOrder: mockProcessOrder,
    });
    vi.mocked(addressServiceModule.AddressService.getAddresses).mockResolvedValue([
      { id: '1', type: 'home', name: 'Home', street: '123 Main St', city: 'Anytown', postalCode: '12345', country: 'USA', isDefault: true },
    ]);
    const mockOrderServiceInstance = vi.mocked(orderServiceModule.OrderService.getInstance());
    mockOrderServiceInstance.placeOrder.mockImplementation(mockPlaceOrder);

    renderCheckoutPage();

    // Finalize order from confirmation step
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar Pedido' }));

    await waitFor(() => {
      expect(mockProcessOrder).toHaveBeenCalledTimes(1);
      expect(screen.getByText(includesText('Pedido Confirmado'))).toBeInTheDocument();
    });
  });
});
