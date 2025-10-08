import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../../src/contexts/CartContext';
import Header from '../../src/components/Header';

const TestProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <CartProvider>
        {children}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  const mockOnCartClick = jest.fn();

  it('renders header correctly', () => {
    render(
      <TestProviders>
        <Header onCartClick={mockOnCartClick} />
      </TestProviders>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays the logo', () => {
    render(
      <TestProviders>
        <Header onCartClick={mockOnCartClick} />
      </TestProviders>
    );

    const logo = screen.getByAltText(/pureza naturalis/i);
    expect(logo).toBeInTheDocument();
  });

  it('shows navigation menu', () => {
    render(
      <TestProviders>
        <Header onCartClick={mockOnCartClick} />
      </TestProviders>
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Tienda')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('displays cart icon with item count', () => {
    render(
      <TestProviders>
        <Header onCartClick={mockOnCartClick} />
      </TestProviders>
    );

    const cartButton = screen.getByRole('button', { name: /carrito/i });
    expect(cartButton).toBeInTheDocument();
  });
});