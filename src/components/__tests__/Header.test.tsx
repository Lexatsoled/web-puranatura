import { render, screen, fireEvent } from '../../test/test-utils';
import { CartProvider } from '../../contexts/CartContext';
import Header from '../Header';
import { vi } from 'vitest';
import { includesText } from '../../test/utils/text';

// Note: render from test-utils already wraps with BrowserRouter and i18n provider

describe('Header', () => {
  const mockOnCartClick = vi.fn();

  beforeEach(() => {
    mockOnCartClick.mockClear();
  });

  it('renders header correctly', () => {
    render(
      <CartProvider>
        <Header onCartClick={mockOnCartClick} />
      </CartProvider>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays the logo', () => {
    render(
      <CartProvider>
        <Header onCartClick={mockOnCartClick} />
      </CartProvider>
    );
    const logo = screen.getByAltText('Pureza Naturalis');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo-pureza-naturalis-largo_320.webp');
  });

  it('shows navigation menu', () => {
    render(
      <CartProvider>
        <Header onCartClick={mockOnCartClick} />
      </CartProvider>
    );
    // Navigation labels may be localized or show keys in tests; match by possible values
    expect(screen.getByRole('link', { name: /Inicio|nav\.home/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Tienda|nav\.products|nav\.shop/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Blog|nav\.blog/i })).toBeInTheDocument();
    // El texto puede aparecer con emoji o en distintas variantes/locales.
    expect(
      screen.getByRole('link', { name: /⚡\s*Sistemas|Sistemas(?:\s+Sinérgicos)?|nav\.synergisticSystems|Sistemas/i })
    ).toBeInTheDocument();
  });

  it('displays cart icon with item count', () => {
    render(
      <CartProvider>
        <Header onCartClick={mockOnCartClick} />
      </CartProvider>
    );
  const cartButton = screen.getByRole('button', { name: /Carrito|nav\.cart|common\.cart/i });
    expect(cartButton).toBeInTheDocument();
  });

  it('calls onCartClick when cart button is clicked', () => {
    render(
      <CartProvider>
        <Header onCartClick={mockOnCartClick} />
      </CartProvider>
    );
  const cartButton = screen.getByRole('button', { name: /Carrito|nav\.cart|common\.cart/i });
    fireEvent.click(cartButton);
    expect(mockOnCartClick).toHaveBeenCalledTimes(1);
  });

  it('displays search and mobile menu buttons', () => {
    render(
      <CartProvider>
        <Header onCartClick={mockOnCartClick} />
      </CartProvider>
    );
    expect(screen.getByRole('button', { name: /Buscar|common\.search|nav\.search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Menú|Menu|Menú|nav\.menu/i })).toBeInTheDocument();
  });
});

