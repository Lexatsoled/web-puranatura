import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from './src/store/cartStore';
import { useAuth } from './src/hooks/useAuth';
import AuthModal from './src/components/AuthModal';
import UserMenu from './src/components/UserMenu';

interface SimpleLayoutProps {
  children: ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleCartClick = () => {
    navigate('/carrito');
  };

  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
    to,
    children,
  }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`nav-link mx-6 text-white/90 text-base py-2 relative transition-all duration-300 ${
          isActive ? 'font-bold text-white' : 'font-medium hover:text-white'
        }`}>
        {children}
      </Link>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f8ff' }}>
      {/* Estilos CSS para animaciones */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          .nav-link {
            position: relative;
            transition: all 0.3s ease;
          }

          .nav-link:hover {
            transform: translateY(-2px);
          }

          .nav-link::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            width: 0;
            height: 2px;
            background-color: #fbbf24;
            transition: all 0.3s ease;
            transform: translateX(-50%);
          }

          .nav-link:hover::after {
            width: 100%;
          }
        `}
      </style>

      {/* Header con navegación funcional y carrito */}
      <header
        role="banner"
        className="bg-primary text-white p-4 flex flex-col items-center shadow-lg"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <img
              src="/logo-pureza-naturalis-largo_320.webp"
              alt="Pureza Naturalis"
              loading="eager"
              decoding="async"
              className="h-[70px] object-contain bg-white rounded-xl p-2 shadow-md"
            />{' '}
          </div>

          {/* Controles del header - Autenticación y Carrito */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Sistema de autenticación */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white border-2 border-white/50 text-primary px-4 py-2 rounded-full cursor-pointer text-sm font-semibold transition-all duration-300 flex items-center gap-2 hover:bg-green-100 hover:border-white/70"
              >
                <svg
                  style={{ width: '18px', height: '18px' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Iniciar Sesión
              </button>
            )}

            {/* Botón del carrito con estilo consistente */}
            <button
              onClick={handleCartClick}
              aria-label={`Carrito de compras, ${cart.count} artículos, total ${cart.total.toFixed(2)} dólares`}
              className="bg-white border-2 border-white/50 text-primary px-4 py-2 rounded-full cursor-pointer text-sm font-semibold transition-all duration-300 flex items-center gap-2 hover:bg-green-100 hover:border-white/70"
            >
              <span style={{ fontSize: '1.1rem' }}>🛒</span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  lineHeight: '1.2',
                }}
              >
                <span>Mi Carrito</span>
                {cart.count > 0 && (
                  <span style={{ fontSize: '0.75rem', opacity: '0.9' }}>
                    ${cart.total.toFixed(2)}
                  </span>
                )}
              </div>
              {cart.count > 0 && (
                <span
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#16a34a',
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
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  {cart.count}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav
          role="navigation"
          aria-label="Navegación principal"
          style={{ marginTop: '0.5rem' }}
        >
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/sobre-nosotros">Sobre Nosotros</NavLink>
          <NavLink to="/servicios">Servicios</NavLink>
          <NavLink to="/sistemas-sinergicos">⚡ Sistemas Sinérgicos</NavLink>
          <NavLink to="/tienda">Tienda</NavLink>
          <NavLink to="/testimonios">Testimonios</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
        </nav>
      </header>

      {/* Contenido principal */}
      <main
        id="main-content"
        role="main"
        style={{ minHeight: 'calc(100vh - 120px)' }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        role="contentinfo"
        className="bg-primary text-white p-4 text-center"
      >
        <p className="m-0">© 2025 Pureza Naturalis - Terapias Naturales</p>
      </footer>

      {/* Modal de autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default SimpleLayout;
