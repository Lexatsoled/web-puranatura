import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../../src/contexts/CartContext';
import Header from '../../src/components/Header';
import { vi } from 'vitest';

const TestProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <CartProvider>{children}</CartProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  const mockOnCartClick = vi.fn();

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

    const logo = screen.getByAltText('Pureza Naturalis');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo-pureza-naturalis-largo_320.webp');
  });

  it('renders the logo and site name', () => {
    render(
      <TestProviders>
        <Header onCartClick={mockOnCartClick} />
      </TestProviders>
    );

    const logo = screen.getByAltText('Pureza Naturalis');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo-pureza-naturalis-largo_320.webp');
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

    const cartButton = screen.getByRole('button', { name: 'Carrito' });
    expect(cartButton).toBeInTheDocument();
  });
});
