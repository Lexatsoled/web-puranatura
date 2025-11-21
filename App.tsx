import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import StorePage from './pages/StorePage';
import TestimonialsPage from './pages/TestimonialsPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AddressesPage from './pages/AddressesPage';
import WishlistPage from './pages/WishlistPage';
import SimpleLayout from './SimpleLayout';
import CartModal from './components/CartModal';

const App: React.FC = () => {
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <WishlistProvider>
            <SimpleLayout onCartClick={() => setCartOpen(true)}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sobre-nosotros" element={<AboutPage />} />
                <Route path="/servicios" element={<ServicesPage />} />
                <Route path="/tienda" element={<StorePage />} />
                <Route path="/testimonios" element={<TestimonialsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/pedidos" element={<OrdersPage />} />
                <Route path="/direcciones" element={<AddressesPage />} />
                <Route path="/lista-deseos" element={<WishlistPage />} />
              </Routes>
            </SimpleLayout>
            <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
          </WishlistProvider>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
