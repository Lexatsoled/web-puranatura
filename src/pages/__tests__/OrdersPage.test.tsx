import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';

// Hoist mocks before importing component under test
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: false, user: null })),
}));

vi.mock('../../store/orderStore', () => ({
  useOrderStore: vi.fn(() => ({ orders: [], loadOrders: vi.fn() })),
}));

import OrdersPage from '../OrdersPage';
import * as useAuthModule from '../../hooks/useAuth';
import * as orderStoreModule from '../../store/orderStore';

describe('OrdersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderOrdersPage = (initialEntries = ['/orders']) => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
  };

  it('shows access denied when not authenticated', () => {
    renderOrdersPage();
    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
    expect(
      screen.getByText((t) =>
        !!t &&
        t
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ')
          .includes('Debes iniciar sesion para ver tus pedidos.')
      )
    ).toBeInTheDocument();
  });

  it('displays empty state when there are no orders', () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({ isAuthenticated: true, user: { id: '1', name: 'Test' } } as any);
    vi.mocked(orderStoreModule.useOrderStore).mockReturnValue({ orders: [], loadOrders: vi.fn() } as any);
    renderOrdersPage();
    expect(screen.getByText(/No tienes pedidos/i)).toBeInTheDocument();
  });

  it('renders orders list for authenticated user', () => {
    const mockOrders = [
      { id: 'PN-2025-001', date: new Date('2025-07-28'), items: [{ id: '1', name: 'Test', price: 100, quantity: 1, image: '' }], total: 100, status: 'delivered', trackingNumber: 'TN123', estimatedDelivery: new Date('2025-07-30') },
      { id: 'PN-2025-002', date: new Date('2025-07-29'), items: [{ id: '2', name: 'Test2', price: 150, quantity: 1, image: '' }], total: 150, status: 'shipped' },
    ];
    vi.mocked(useAuthModule.useAuth).mockReturnValue({ isAuthenticated: true, user: { id: '1', name: 'Test' } } as any);
    vi.mocked(orderStoreModule.useOrderStore).mockReturnValue({ orders: mockOrders, loadOrders: vi.fn() } as any);
    renderOrdersPage();

  expect(screen.getByText('Pedido #PN-2025-001')).toBeInTheDocument();
  // Aceptar fechas en formatos dd/mm/yyyy o mm/dd/yyyy según locale
  // usar getAllByText y seleccionar el primero (pedido 1)
  expect(screen.getAllByText(/Realizado el\s*\d{1,2}\/\d{1,2}\/2025/)[0]).toBeInTheDocument();
  expect(screen.getAllByText(/\b100\.00\b/)[0]).toBeInTheDocument();
    expect(screen.getByText('Entregado')).toBeInTheDocument();

  expect(screen.getByText('Pedido #PN-2025-002')).toBeInTheDocument();
  expect(screen.getAllByText(/Realizado el\s*\d{1,2}\/\d{1,2}\/2025/)[1]).toBeInTheDocument();
  expect(screen.getAllByText(/\b150\.00\b/)[0]).toBeInTheDocument();
    expect(screen.getByText('Enviado')).toBeInTheDocument();
  });

  it('calls loadOrders on mount when authenticated', async () => {
    const mockLoadOrders = vi.fn();
    vi.mocked(useAuthModule.useAuth).mockReturnValue({ isAuthenticated: true, user: { id: '1', name: 'Test' } } as any);
    vi.mocked(orderStoreModule.useOrderStore).mockReturnValue({ orders: [], loadOrders: mockLoadOrders } as any);
    renderOrdersPage();
    await waitFor(() => expect(mockLoadOrders).toHaveBeenCalledTimes(1));
  });
});


