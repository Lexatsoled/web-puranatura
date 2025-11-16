import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { withLazyLoading } from '../utils/performance/lazy';
import PageTransition from '../components/PageTransition';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

// Loading component for route-based lazy loading
// const RouteLoadingFallback = () => (
<div className="flex items-center justify-center min-h-screen">
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
</div>;
// Importación perezosa de páginas con error boundaries
const HomePage = withLazyLoading(React.lazy(() => import('../pages/HomePage')));
const StorePage = withLazyLoading(
  React.lazy(() => import('../pages/StorePage'))
);
const ProductPage = withLazyLoading(
  React.lazy(() => import('../pages/ProductPage'))
);
const BlogPage = withLazyLoading(React.lazy(() => import('../pages/BlogPage')));
const BlogPostPage = withLazyLoading(
  React.lazy(() => import('../pages/BlogPostPage'))
);
const AboutPage = withLazyLoading(
  React.lazy(() => import('../pages/AboutPage'))
);
const ContactPage = withLazyLoading(
  React.lazy(() => import('../pages/ContactPage'))
);
const ServicesPage = withLazyLoading(
  React.lazy(() => import('../pages/ServicesPage'))
);
const ServicePage = withLazyLoading(
  React.lazy(() => import('../pages/ServicePage'))
);
const TestimonialsPage = withLazyLoading(
  React.lazy(() => import('../pages/TestimonialsPage'))
);
const CheckoutPage = withLazyLoading(
  React.lazy(() => import('../pages/CheckoutPage'))
);
const OrderConfirmationPage = withLazyLoading(
  React.lazy(() => import('../pages/OrderConfirmationPage'))
);
const ProfilePage = withLazyLoading(
  React.lazy(() => import('../pages/ProfilePage'))
);
const OrdersPage = withLazyLoading(
  React.lazy(() => import('../pages/OrdersPage'))
);
const AddressesPage = withLazyLoading(
  React.lazy(() => import('../pages/AddressesPage'))
);
const WishlistPage = withLazyLoading(
  React.lazy(() => import('../pages/WishlistPage'))
);
const AccountSettingsPage = withLazyLoading(
  React.lazy(() => import('../pages/AccountSettings'))
);
const CartPage = withLazyLoading(React.lazy(() => import('../pages/CartPage')));
const SistemasSinergicosPage = withLazyLoading(
  React.lazy(() => import('../pages/SistemasSinergicosPage'))
);
const NotFoundPage = withLazyLoading(
  React.lazy(() => import('../pages/NotFoundPage'))
);

const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary componentName="AppRoutes">
      <PageTransition>
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary componentName="HomePage">
                <HomePage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/tienda"
            element={
              <ErrorBoundary componentName="StorePage">
                <StorePage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/tienda/producto/:productId"
            element={
              <ErrorBoundary componentName="ProductPage">
                <ProductPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/blog"
            element={
              <ErrorBoundary componentName="BlogPage">
                <BlogPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <ErrorBoundary componentName="BlogPostPage">
                <BlogPostPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/sobre-nosotros"
            element={
              <ErrorBoundary componentName="AboutPage">
                <AboutPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/contacto"
            element={
              <ErrorBoundary componentName="ContactPage">
                <ContactPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/servicios"
            element={
              <ErrorBoundary componentName="ServicesPage">
                <ServicesPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/servicios/:serviceId"
            element={
              <ErrorBoundary componentName="ServicePage">
                <ServicePage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/testimonios"
            element={
              <ErrorBoundary componentName="TestimonialsPage">
                <TestimonialsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/checkout"
            element={
              <ErrorBoundary componentName="CheckoutPage">
                <CheckoutPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/pedido-confirmado/:orderId"
            element={
              <ErrorBoundary componentName="OrderConfirmationPage">
                <OrderConfirmationPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/perfil"
            element={
              <ErrorBoundary componentName="ProfilePage">
                <ProfilePage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/pedidos"
            element={
              <ErrorBoundary componentName="OrdersPage">
                <OrdersPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/direcciones"
            element={
              <ErrorBoundary componentName="AddressesPage">
                <AddressesPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/lista-deseos"
            element={
              <ErrorBoundary componentName="WishlistPage">
                <WishlistPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/configuracion-cuenta"
            element={
              <ErrorBoundary componentName="AccountSettingsPage">
                <AccountSettingsPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/carrito"
            element={
              <ErrorBoundary componentName="CartPage">
                <CartPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/sistemas-sinergicos"
            element={
              <ErrorBoundary componentName="SistemasSinergicosPage">
                <SistemasSinergicosPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="*"
            element={
              <ErrorBoundary componentName="NotFoundPage">
                <NotFoundPage />
              </ErrorBoundary>
            }
          />
        </Routes>
      </PageTransition>
    </ErrorBoundary>
  );
};

export default AppRoutes;
