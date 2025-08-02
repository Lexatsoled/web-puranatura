import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from './contexts/CartContext';
import { useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';

interface SimpleLayoutProps {
  children: ReactNode;
  onCartClick: () => void;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children, onCartClick }) => {
  const location = useLocation();
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className="nav-link"
        style={{ 
          margin: '0 1.5rem', 
          color: isActive ? '#fbbf24' : 'white',
          textDecoration: 'none',
          fontWeight: isActive ? '700' : '500',
          fontSize: '1rem',
          padding: '0.5rem 0',
          position: 'relative',
          transition: 'all 0.3s ease'
        }}
      >
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
      <header style={{ 
        backgroundColor: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        color: 'white', 
        padding: '1rem', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%',
          maxWidth: '1200px'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.8rem', 
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            🌿 PuraNatura
          </h1>
          
          {/* Controles del header - Autenticación y Carrito */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Sistema de autenticación */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Iniciar Sesión
              </button>
            )}
            
            {/* Botón del carrito con estilo consistente */}
            <button
              onClick={onCartClick}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '1.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>🛒</span>
              <span>Mi Carrito</span>
              {cartCount > 0 && (
                <span style={{
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
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
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
        </nav>
      </header>
      
      {/* Contenido principal */}
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        {children}
      </main>
      
      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#065f46', 
        color: 'white', 
        padding: '1rem', 
        textAlign: 'center' 
      }}>
        <p style={{ margin: 0 }}>© 2025 PuraNatura - Terapias Naturales</p>
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
