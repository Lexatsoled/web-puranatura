import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { WishlistProvider } from '../contexts/WishlistContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { UserIcon, ShoppingCartIcon } from './icons';
import { CookieBanner } from './CookieBanner';

const UserMenu = React.lazy(() => import('./layout/UserMenu'));
const AuthModal = React.lazy(() => import('./auth/AuthModal'));
const CartModal = React.lazy(() => import('./CartModal'));

// Estilos convertidos a objetos JS para evitar styled-jsx
const theme = {
  headerBg: '#0f5132',
  navColor: '#f8fafc',
  navActive: '#facc15',
};

const SimpleLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <NotificationProvider>
    <WishlistProvider>
      <LayoutContent>{children}</LayoutContent>
      <CookieBanner />
    </WishlistProvider>
  </NotificationProvider>
);

const LayoutContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const cartCount = useCartStore((state) => state.cart.count);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
    to,
    children,
  }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`nav-link${isActive ? ' nav-link--active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </Link>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f8ff' }}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          .nav-link {
            position: relative;
            transition: all 0.2s ease;
            margin: 0 0.75rem;
            color: ${theme.navColor};
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            padding: 0.5rem 0.9rem;
            border-radius: 0.9rem;
            display: inline-block;
            line-height: 1.4;
            outline: none;
          }

          .nav-link:hover {
            transform: translateY(-1px);
            background-color: rgba(255, 255, 255, 0.08);
            color: #fefce8;
          }

          .nav-link:focus-visible {
            box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.5);
            background-color: rgba(255, 255, 255, 0.12);
            color: #fefce8;
          }

          .nav-link::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 50%;
            width: 0;
            height: 2px;
            background-color: ${theme.navActive};
            transition: all 0.2s ease;
            transform: translateX(-50%);
          }

          .nav-link:hover::after {
            width: 100%;
          }

          .nav-link--active {
            color: ${theme.navActive};
            font-weight: 700;
            background-color: rgba(255, 255, 255, 0.08);
          }

          .nav-link--active::after {
            width: 100%;
          }

          .header-button {
            background-color: #ecfdf3;
            color: #0f172a;
            border: 2px solid rgba(12, 74, 40, 0.35);
            padding: 0.55rem 1.1rem;
            border-radius: 9999px;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 700;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            line-height: 1.2;
            text-decoration: none;
          }

          .header-button:hover {
            background-color: #d1fae5;
            border-color: rgba(34, 197, 94, 0.7);
            color: #0b1f13;
          }

          .header-button:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.55);
          }

          .header-button--secondary {
            background-color: #fef3c7;
            border-color: rgba(234, 179, 8, 0.55);
          }

          .header-button--secondary:hover {
            background-color: #fde68a;
            border-color: rgba(202, 138, 4, 0.75);
          }
        `}
      </style>

      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-999px',
          top: '-999px',
          backgroundColor: '#0f5132',
          color: '#fff',
          padding: '0.75rem 1rem',
          zIndex: 1000,
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '1rem';
          e.currentTarget.style.top = '1rem';
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-999px';
          e.currentTarget.style.top = '-999px';
        }}
      >
        Saltar al contenido principal
      </a>

      <header
        style={{
          position: 'relative',
          backgroundColor: theme.headerBg,
          color: 'white',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1200px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '1.8rem',
              fontWeight: '700',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            PuraNatura
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAuthenticated ? (
              <React.Suspense fallback={null}>
                <UserMenu />
              </React.Suspense>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="header-button"
                aria-label="Abrir inicio de sesion"
              >
                <UserIcon className="w-[18px] h-[18px]" />
                Iniciar sesion
              </button>
            )}

            <button
              onClick={handleCartOpen}
              className="header-button header-button--secondary"
              aria-label="Abrir carrito"
            >
              <ShoppingCartIcon className="w-[18px] h-[18px]" />
              <span>Mi Carrito</span>
              {cartCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#ffffff',
                    color: theme.headerBg,
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    marginLeft: '0.25rem',
                    animation: 'pulse 2s infinite',
                    border: `1px solid ${theme.headerBg}`,
                  }}
                  data-testid="cart-counter"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav style={{ marginTop: '0.5rem' }}>
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/sobre-nosotros">Sobre Nosotros</NavLink>
          <NavLink to="/servicios">Servicios</NavLink>
          <NavLink to="/tienda">Tienda</NavLink>
          <NavLink to="/testimonios">Testimonios</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
          <NavLink to="/metricas">Metricas</NavLink>
        </nav>
      </header>

      <main id="main-content" style={{ minHeight: '100vh' }}>
        {children}
      </main>

      <footer
        style={{
          backgroundColor: '#065f46',
          color: 'white',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0 }}>(c) 2025 PuraNatura - Terapias Naturales</p>
      </footer>

      <React.Suspense fallback={null}>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </React.Suspense>
      <React.Suspense fallback={null}>
        <CartModal isOpen={isCartOpen} onClose={handleCartClose} />
      </React.Suspense>
    </div>
  );
};

export default SimpleLayout;
