import React, { Suspense, useEffect, useState } from 'react';
// Replaced framer-motion animations with lightweight CSS/Tailwind transitions
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './layout/Footer';

// Lazy loading de componentes modales
const CartModal = React.lazy(() => import('./CartModal'));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Manejar el scroll para efectos en el header
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Resetear el scroll al cambiar de página
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsPageTransitioning(true);
    const timer = setTimeout(() => setIsPageTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Prevenir scroll cuando los modales están abiertos
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  // Page transitions handled via CSS classes (isPageTransitioning state)

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-grow">
        {/* Simple CSS-based page transition: apply transform + opacity while `isPageTransitioning` */}
        <div
          key={location.pathname}
          className={`w-full transition-transform transition-opacity duration-300 ease-out ${isPageTransitioning ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
        >
          {children}
        </div>
      </main>

      <Footer />

      {/* Modales con Suspense y fallback optimizado */}
      {isCartOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          }
        >
          <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </Suspense>
      )}

      {/* Search modal commented out until SearchModal component is implemented
        {isSearchOpen && (
          <Suspense
            fallback={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50"
              >
                <div className="animate-pulse flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              </motion.div>
            }
          >
            <SearchModal onClose={() => setIsSearchOpen(false)} />
          </Suspense>
        )}
        */}

      {/* Indicador de carga para transiciones de página */}
      {/* Indicador de carga para transiciones de página (CSS-driven) */}
      {isPageTransitioning && (
        <div className="fixed top-0 left-0 w-full h-1 bg-green-600">
          <div className="h-full bg-green-400 w-full transition-width duration-300" />
        </div>
      )}
    </div>
  );
};

export default Layout;
