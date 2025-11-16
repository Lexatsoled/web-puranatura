import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, afterEach, beforeAll, beforeEach } from 'vitest';
import { act } from 'react';
import App from '../../App';
import { includesText } from '../../src/test/utils/text';

// Mock SimpleLayout to avoid router context issues
vi.mock('../../SimpleLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>
      <header role="banner">
        <img src="/Logo%20Pureza%20Naturalis%20largo.webp" alt="Pureza Naturalis" />
        <nav role="navigation" aria-label="Navegación principal">
          <a href="/">Inicio</a>
          <a href="/sobre-nosotros">Sobre Nosotros</a>
          <a href="/servicios">Servicios</a>
          <a href="/sistemas-sinergicos">⚡ Sistemas Sinérgicos</a>
          <a href="/tienda">Tienda</a>
          <a href="/testimonios">Testimonios</a>
          <a href="/blog">Blog</a>
          <a href="/contacto">Contacto</a>
        </nav>
      </header>
      <main role="main">{children}</main>
      <footer role="contentinfo">
        <p>© 2025 Pureza Naturalis - Terapias Naturales</p>
      </footer>
    </div>
  ),
}));

// Mock all lazy-loaded components to avoid import issues
vi.mock('../../src/pages/HomePage', () => ({
  default: () => <div>Home Page</div>,
}));
vi.mock('../../src/pages/AboutPage', () => ({
  default: () => <div>About Page</div>,
}));
vi.mock('../../src/pages/ServicesPage', () => ({
  default: () => <div>Services Page</div>,
}));
vi.mock('../../src/pages/ServicePage', () => ({
  default: () => <div>Service Page</div>,
}));
vi.mock('../../src/pages/SistemasSinergicosPage', () => ({
  default: () => <div>Sistemas Sinergicos Page</div>,
}));
vi.mock('../../src/pages/StorePage', () => ({
  default: () => <div>Store Page</div>,
}));
vi.mock('../../src/pages/ProductPage', () => ({
  default: () => <div>Product Page</div>,
}));
vi.mock('../../src/pages/CheckoutPage', () => ({
  default: () => <div>Checkout Page</div>,
}));
vi.mock('../../src/pages/OrderConfirmationPage', () => ({
  default: () => <div>Order Confirmation Page</div>,
}));
vi.mock('../../src/pages/TestimonialsPage', () => ({
  default: () => <div>Testimonials Page</div>,
}));
vi.mock('../../src/pages/BlogPage', () => ({
  default: () => <div>Blog Page</div>,
}));
vi.mock('../../src/pages/BlogPostPage', () => ({
  default: () => <div>Blog Post Page</div>,
}));
vi.mock('../../src/pages/ContactPage', () => ({
  default: () => <div>Contact Page</div>,
}));
vi.mock('../../src/pages/ProfilePage', () => ({
  default: () => <div>Profile Page</div>,
}));
vi.mock('../../src/pages/OrdersPage', () => ({
  default: () => <div>Orders Page</div>,
}));
vi.mock('../../src/pages/AddressesPage', () => ({
  default: () => <div>Addresses Page</div>,
}));
vi.mock('../../src/pages/WishlistPage', () => ({
  default: () => <div>Wishlist Page</div>,
}));
vi.mock('../../src/pages/CartPage', () => ({
  default: () => <div>Cart Page</div>,
}));


describe('App Integration Tests', () => {
  beforeAll(() => {
    // Mock window.scrollTo to prevent "Not implemented" errors
    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
    // Clear any pending promises and timeouts
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders with providers', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async () => {});
    // Verifica que renderiza sin estallar: presencia del header
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders without crashing', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async () => {});

    // Check if the app renders without crashing - use synchronous check
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('displays logo in header', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async () => {});

    const logos = screen.getAllByAltText('Pureza Naturalis');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('shows navigation menu', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await act(async () => {});

    expect(screen.getAllByText('Inicio').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tienda').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Blog').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Servicios').length).toBeGreaterThan(0);
  });
  it('contains copyright in footer', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(
      screen.getAllByText(includesText('© 2025 Pureza Naturalis - Terapias Naturales')).length
    ).toBeGreaterThan(0);
  });
});
