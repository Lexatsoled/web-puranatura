import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Eager load for critical LCP path
import HomePage from './pages/HomePage';
import SimpleLayout from './components/SimpleLayout';

// const SimpleLayout = React.lazy(() => import('./components/SimpleLayout')); // Removed lazy
// const HomePage = React.lazy(() => import('./pages/HomePage')); // Removed lazy
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
const ProductPage = React.lazy(() => import('./pages/ProductPage'));

const LayoutFallback = () => (
  <main className="flex min-h-screen items-center justify-center bg-emerald-50 text-green-800 p-6">
    <div role="status" aria-live="polite">
      Cargando la capa visual…
    </div>
  </main>
);

import { useAuthStore } from './store/authStore';

const App: React.FC = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Suspense fallback={<LayoutFallback />}>
      <SimpleLayout>
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
            <Route path="/lista-deseos" element={<WishlistPage />} />
            <Route path="/metricas" element={<MetricsDashboardPage />} />
            <Route path="/producto/:id" element={<ProductPage />} />
          </Routes>
        </Suspense>
      </SimpleLayout>
    </Suspense>
  );
};

export default App;
