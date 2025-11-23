import React, { Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import SimpleLayout from './SimpleLayout';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const StorePage = React.lazy(() => import('./pages/StorePage'));
const TestimonialsPage = React.lazy(() => import('./pages/TestimonialsPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const AddressesPage = React.lazy(() => import('./pages/AddressesPage'));
const WishlistPage = React.lazy(() => import('./pages/WishlistPage'));
const MetricsDashboardPage = React.lazy(
  () => import('./pages/MetricsDashboardPage')
);
const CartModal = React.lazy(() => import('./components/CartModal'));

const App: React.FC = () => {
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <SimpleLayout onCartClick={() => setCartOpen(true)}>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-16 text-gray-600">
                    Cargando...
                  </div>
                }
              >
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
                  <Route path="/metricas" element={<MetricsDashboardPage />} />
                </Routes>
              </Suspense>
            </SimpleLayout>
            <Suspense fallback={null}>
              <CartModal
                isOpen={isCartOpen}
                onClose={() => setCartOpen(false)}
              />
            </Suspense>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
