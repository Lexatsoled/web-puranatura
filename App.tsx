
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import StorePage from './pages/StorePage';
import TestimonialsPage from './pages/TestimonialsPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import { CartProvider } from './contexts/CartContext';
import CartModal from './components/CartModal';

export type Page = 'Inicio' | 'Sobre Nosotros' | 'Servicios' | 'Tienda' | 'Testimonios' | 'Blog' | 'Contacto';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('Inicio');
    const [isCartOpen, setCartOpen] = useState(false);

    const renderPage = () => {
        switch (currentPage) {
            case 'Inicio':
                return <HomePage setCurrentPage={setCurrentPage} />;
            case 'Sobre Nosotros':
                return <AboutPage />;
            case 'Servicios':
                return <ServicesPage />;
            case 'Tienda':
                return <StorePage />;
            case 'Testimonios':
                return <TestimonialsPage />;
            case 'Blog':
                return <BlogPage />;
            case 'Contacto':
                return <ContactPage />;
            default:
                return <HomePage setCurrentPage={setCurrentPage} />;
        }
    };

    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen bg-emerald-50 text-gray-800">
                <Header setCurrentPage={setCurrentPage} onCartClick={() => setCartOpen(true)} currentPage={currentPage}/>
                <main className="flex-grow">
                    {renderPage()}
                </main>
                <Footer />
                <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
            </div>
        </CartProvider>
    );
};

export default App;
