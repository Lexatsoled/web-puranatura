import React, { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Lazy loading de componentes modales
const CartModal = React.lazy(() => import('./CartModal'));
const SearchModal = React.lazy(() => import('./SearchModal'));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    if (isCartOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, isSearchOpen]);

  const pageTransitionVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  // Error Boundary personalizado para los componentes lazy
  const ErrorFallback = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
      <div className="text-center">
        <p className="text-red-600 mb-4">Hubo un error al cargar el contenido</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Recargar página
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        isScrolled={isScrolled}
        onCartClick={() => setIsCartOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`w-full ${isPageTransitioning ? 'pointer-events-none' : ''}`}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Modales con Suspense y fallback optimizado */}
      <AnimatePresence>
        {isCartOpen && (
          <Suspense
            fallback={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50"
              >
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </motion.div>
            }
          >
            <CartModal onClose={() => setIsCartOpen(false)} />
          </Suspense>
        )}

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
      </AnimatePresence>

      {/* Indicador de carga para transiciones de página */}
      <AnimatePresence>
        {isPageTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-1 bg-green-600"
          >
            <motion.div
              className="h-full bg-green-400"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
