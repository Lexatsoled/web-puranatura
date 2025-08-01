import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  onCartClick: () => void;
}

const pageLinks: { name: string; path: string }[] = [
  { name: 'Inicio', path: '/' },
  { name: 'Sobre Nosotros', path: '/sobre-nosotros' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Tienda', path: '/tienda' },
  { name: 'Testimonios', path: '/testimonios' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contacto', path: '/contacto' },
];

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}
    >
      {children}
    </Link>
  );
};

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-800 font-display">
          PuraNatura
        </Link>
        <nav className="hidden lg:flex items-center space-x-2">
          {pageLinks.map((link) => (
            <NavLink key={link.path} to={link.path}>
              {link.name}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center">
          <button
            onClick={onCartClick}
            className="relative text-gray-600 hover:text-green-600 transition-colors duration-300 mr-4"
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
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            {pageLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center py-2 text-gray-700 hover:bg-green-100"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
