import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../../src/contexts/CartContext';
import { NotificationProvider } from '../../src/contexts/NotificationContext';
import CartModal from '../../src/components/CartModal';
import { vi } from 'vitest';
import { includesText } from '../../src/test/utils/text';

const TestProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <CartProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

describe('CartModal Component', () => {
  it('renders when isOpen is true', () => {
    const mockOnClose = vi.fn();

    render(
      <TestProviders>
        <CartModal isOpen={true} onClose={mockOnClose} />
      </TestProviders>
    );

    expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const mockOnClose = vi.fn();

    render(
      <TestProviders>
        <CartModal isOpen={false} onClose={mockOnClose} />
      </TestProviders>
    );

    expect(screen.queryByText('Carrito de Compras')).not.toBeInTheDocument();
  });

  it('displays empty cart message when cart is empty', () => {
    const mockOnClose = vi.fn();

    render(
      <TestProviders>
        <CartModal isOpen={true} onClose={mockOnClose} />
      </TestProviders>
    );

    expect(screen.getByText(includesText('Tu carrito está vacío'))).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();

    render(
      <TestProviders>
        <CartModal isOpen={true} onClose={mockOnClose} />
      </TestProviders>
    );

    const closeButton = screen.getByRole('button', { name: 'Cerrar carrito' });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

