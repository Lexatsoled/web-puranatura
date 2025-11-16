import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OrderConfirmationPage from '../OrderConfirmationPage';
import { vi } from 'vitest';
import { includesText } from '../../test/utils/text';

describe('OrderConfirmationPage', () => {
  beforeEach(() => {
    vi.useRealTimers();
    const store: Record<string, string> = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((k: string) => store[k] ?? null),
        setItem: vi.fn((k: string, v: string) => (store[k] = v)),
        removeItem: vi.fn((k: string) => delete store[k]),
        clear: vi.fn(() => Object.keys(store).forEach((k) => delete store[k])),
      },
      writable: true,
    });
  });

  const renderWithRoute = (initialEntries: string[]) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/tienda" element={<div>Tienda Page</div>} />
          <Route path="/pedido-confirmado/:orderId" element={<OrderConfirmationPage />} />
        </Routes>
      </MemoryRouter>
    );

  it('shows confirmation when order exists in storage', async () => {
    const order = {
      id: '123',
      date: new Date().toISOString(),
      items: [
        {
          product: { id: '1', name: 'Producto', price: 10, images: [{ full: 'x', thumbnail: 'x' }] },
          quantity: 2,
        },
      ],
      shippingAddress: {
        firstName: 'Juan',
        lastName: 'Pérez',
        street: 'Calle 1',
        city: 'SD',
        state: 'DN',
        postalCode: '10101',
        country: 'DO',
        phone: '809',
      },
      paymentMethod: { type: 'cash_on_delivery' },
      orderNotes: '',
      summary: { subtotal: 20, shipping: 0, tax: 3.6, discount: 0, total: 23.6 },
      status: 'confirmed',
    } as const;
    window.localStorage.setItem('pureza-naturalis-orders', JSON.stringify([order]));
    renderWithRoute(['/pedido-confirmado/123']);

    await waitFor(() => {
      expect(screen.getByText(includesText('Pedido Confirmado'))).toBeInTheDocument();
      expect(screen.getByText('#123')).toBeInTheDocument();
      expect(screen.getByText('Producto')).toBeInTheDocument();
      expect(screen.getByText('DOP $23.60')).toBeInTheDocument();
    });
  });

  it('shows not-found message when order is missing', async () => {
    window.localStorage.setItem('pureza-naturalis-orders', JSON.stringify([]));
    renderWithRoute(['/pedido-confirmado/999']);
    expect(
      screen.getByText(includesText('Pedido no encontrado'))
    ).toBeInTheDocument();
  });
});
