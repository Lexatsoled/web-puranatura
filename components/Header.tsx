
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Page } from '../App';

interface HeaderProps {
    setCurrentPage: (page: Page) => void;
    onCartClick: () => void;
    currentPage: Page;
}

const NavLink: React.FC<{ page: Page; currentPage: Page; setCurrentPage: (page: Page) => void; children: React.ReactNode }> = ({ page, currentPage, setCurrentPage, children }) => (
    <button
        onClick={() => setCurrentPage(page)}
        className={`px-4 py-2 text-sm font-semibold transition-colors duration-300 ${currentPage === page ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}
    >
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ setCurrentPage, onCartClick, currentPage }) => {
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const pages: Page[] = ['Inicio', 'Sobre Nosotros', 'Servicios', 'Tienda', 'Testimonios', 'Blog', 'Contacto'];

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div 
                  className="text-2xl font-bold text-green-800 font-display cursor-pointer"
                  onClick={() => setCurrentPage('Inicio')}
                >
                    PuraNatura
                </div>
                <nav className="hidden lg:flex items-center space-x-2">
                    {pages.map(page => <NavLink key={page} page={page} currentPage={currentPage} setCurrentPage={setCurrentPage}>{page}</NavLink>)}
                </nav>
                <div className="flex items-center">
                    <button onClick={onCartClick} className="relative text-gray-600 hover:text-green-600 transition-colors duration-300 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button className="lg:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                 <div className="lg:hidden bg-white/95">
                    <nav className="flex flex-col items-center py-4">
                       {pages.map(page => (
                            <button
                                key={page}
                                onClick={() => {
                                    setCurrentPage(page);
                                    setIsMenuOpen(false);
                                }}
                                className="block w-full text-center py-2 text-gray-700 hover:bg-green-100"
                            >
                                {page}
                            </button>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
