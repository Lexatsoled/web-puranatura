import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../../src/contexts/CartContext';
import { NotificationProvider } from '../../src/contexts/NotificationContext';
import CartModal from '../../src/components/CartModal';

const TestProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <CartProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

describe('CartModal Component', () => {
  it('renders when isOpen is true', () => {
    const mockOnClose = jest.fn();
    
    render(
      <TestProviders>
        <CartModal isOpen={true} onClose={mockOnClose} />
      </TestProviders>
    );

    expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const mockOnClose = jest.fn();
    
    render(
      <TestProviders>
        <CartModal isOpen={false} onClose={mockOnClose} />
      </TestProviders>
    );

    expect(screen.queryByText('Carrito de Compras')).not.toBeInTheDocument();
  });

  it('displays empty cart message when cart is empty', () => {
    const mockOnClose = jest.fn();
    
    render(
      <TestProviders>
        <CartModal isOpen={true} onClose={mockOnClose} />
      </TestProviders>
    );

    expect(screen.getByText(/Tu carrito está vacío/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    
    render(
      <TestProviders>
        <CartModal isOpen={true} onClose={mockOnClose} />
      </TestProviders>
    );

    const closeButton = screen.getByRole('button', { name: /cerrar/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});