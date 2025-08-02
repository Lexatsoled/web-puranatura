import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from './contexts/CartContext';

interface SimpleLayoutProps {
  children: ReactNode;
  onCartClick: () => void;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children, onCartClick }) => {
  const location = useLocation();
  const { cartCount } = useCart();
  
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
          
          {/* Botón del carrito mejorado */}
          <button
            onClick={onCartClick}
            style={{
              backgroundColor: '#4ade80',
              border: 'none',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#22c55e';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4ade80';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 222, 128, 0.3)';
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🛒</span>
            <span>Mi Carrito</span>
            {cartCount > 0 && (
              <span style={{
                backgroundColor: '#15803d',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                marginLeft: '0.25rem',
                animation: 'pulse 2s infinite',
                border: '2px solid #ffffff',
                boxShadow: '0 2px 8px rgba(21, 128, 61, 0.4)'
              }}>
                {cartCount}
              </span>
            )}
          </button>
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
    </div>
  );
};

export default SimpleLayout;
