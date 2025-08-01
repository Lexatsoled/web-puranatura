import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import StorePage from './pages/StorePage';
import TestimonialsPage from './pages/TestimonialsPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import { CartProvider } from './contexts/CartContext';
import CartModal from './components/CartModal';

const App: React.FC = () => {
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <Layout onCartClick={() => setCartOpen(true)}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/tienda" element={<StorePage />} />
          <Route path="/testimonios" element={<TestimonialsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contacto" element={<ContactPage />} />
        </Routes>
      </Layout>
      <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </CartProvider>
  );
};

export default App;
