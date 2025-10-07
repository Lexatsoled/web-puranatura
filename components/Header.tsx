import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '../src/store/cartStore';

const menuItems: { name: string; path: string; highlight?: boolean }[] = [
  { name: 'Inicio', path: '/' },
  { name: 'Sobre Nosotros', path: '/sobre-nosotros' },
  { name: 'Servicios', path: '/servicios' },
  { name: '⚡ Sistemas Sinérgicos', path: '/sistemas-sinergicos', highlight: true },
  { name: 'Tienda', path: '/tienda' },
  { name: 'Testimonios', path: '/testimonios' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contacto', path: '/contacto' },
];

const NavLink: React.FC<{ to: string; children: React.ReactNode; highlight?: boolean }> = ({ to, children, highlight }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (highlight) {
    return (
      <Link
        to={to}
        className={`px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105 ${
          isActive ? 'ring-2 ring-green-300' : ''
        }`}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`px-4 py-2 text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}
    >
      {children}
    </Link>
  );
};

const Header: React.FC = () => {
  const { cart } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate('/carrito');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-800 font-display">
          PuraNatura
        </Link>
        <nav className="hidden lg:flex items-center space-x-2">
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} highlight={item.highlight}>
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center">
          <button
            onClick={handleCartClick}
            className="relative text-gray-600 hover:text-green-600 transition-colors duration-300 mr-4"
            aria-label="Ver carrito de compras"
            title="Carrito de compras"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cart.count > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.count}
              </span>
            )}
          </button>
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú de navegación"
            title="Menú"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95">
          <nav className="flex flex-col items-center py-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-center py-2 ${
                  item.highlight
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold mx-2 my-1 rounded-lg'
                    : 'text-gray-700 hover:bg-green-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
