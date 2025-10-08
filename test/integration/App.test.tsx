import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import { CartProvider } from '../../src/contexts/CartContext';
import { WishlistProvider } from '../../src/contexts/WishlistContext';
import { NotificationProvider } from '../../src/contexts/NotificationContext';
import { AuthProvider } from '../../src/contexts/AuthContext';

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('App Integration Tests', () => {
  it('renders main layout', () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );

    // Check if header is rendered
    expect(screen.getByRole('banner')).toBeInTheDocument();
    
    // Check if main content area exists
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays logo in header', () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );

    const logo = screen.getByAltText(/pureza naturalis/i);
    expect(logo).toBeInTheDocument();
  });

  it('shows navigation menu', () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Tienda')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Servicios')).toBeInTheDocument();
  });

  it('contains copyright in footer', () => {
    render(
      <AllProviders>
        <App />
      </AllProviders>
    );

    expect(screen.getByText(/© 2024 Pureza Naturalis/)).toBeInTheDocument();
  });
});