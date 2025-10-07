import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import NotificationContainer from './src/components/NotificationContainer';
import CartNotification from './components/CartNotification';
import ScrollManager from './src/components/ScrollManager';
import { useCartNotificationStore } from './src/store/cartNotificationStore';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import StorePage from './pages/StorePage';
import ProductPage from './src/pages/ProductPage';
import CheckoutPage from './src/pages/CheckoutPage';
import OrderConfirmationPage from './src/pages/OrderConfirmationPage';
import TestimonialsPage from './pages/TestimonialsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ServicePage from './pages/ServicePage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AddressesPage from './pages/AddressesPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import SistemasSinergicosPage from './src/pages/SistemasSinergicosPage';
import SimpleLayout from './SimpleLayout';

const App: React.FC = () => {
  const { isVisible, productName, totalItems, totalPrice, hideNotification } = useCartNotificationStore();

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ScrollManager />
          <SimpleLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sobre-nosotros" element={<AboutPage />} />
              <Route path="/servicios" element={<ServicesPage />} />
              <Route path="/servicios/:serviceId" element={<ServicePage />} />
              <Route path="/sistemas-sinergicos" element={<SistemasSinergicosPage />} />
              <Route path="/tienda" element={<StorePage />} />
              <Route path="/producto/:productId" element={<ProductPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/pedido-confirmado/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/testimonios" element={<TestimonialsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:postId" element={<BlogPostPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/pedidos" element={<OrdersPage />} />
              <Route path="/direcciones" element={<AddressesPage />} />
              <Route path="/lista-deseos" element={<WishlistPage />} />
              <Route path="/carrito" element={<CartPage />} />
            </Routes>
          </SimpleLayout>
          <NotificationContainer />
          <CartNotification
            isVisible={isVisible}
            productName={productName}
            totalItems={totalItems}
            totalPrice={totalPrice}
            onClose={hideNotification}
          />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
