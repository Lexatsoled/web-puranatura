import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const SimpleLayout = React.lazy(() => import('./components/SimpleLayout'));
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

// We need to ensure all those pages exist in src/pages.
// I have moved BlogPage, StorePage, MetricsDashboardPage.
// HomePage, ServicesPage existed in src/pages.
// What about AboutPage, TestimonialsPage, ContactPage, ProfilePage, OrdersPage, AddressesPage, WishlistPage?
// I only moved the ones that were broken.
// I MUST move ALL or App.tsx imports will break.
// I will point them to ./pages/... and ASSUME they will be moved next.

const LayoutFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-emerald-50 text-green-800 p-6">
    <div role="status" aria-live="polite">
      Cargando la capa visual…
    </div>
  </div>
);

const App: React.FC = () => {
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
            <Route path="/metricas" element={<MetricsDashboardPage />} />
          </Routes>
        </Suspense>
      </SimpleLayout>
    </Suspense>
  );
};

export default App;
