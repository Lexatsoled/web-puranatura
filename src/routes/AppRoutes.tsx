import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { withLazyLoading } from '../hooks/usePerformance';
import PageTransition from '../components/PageTransition';

// Importación perezosa de páginas
const HomePage = withLazyLoading(React.lazy(() => import('../pages/HomePage')));
const StorePage = withLazyLoading(React.lazy(() => import('../pages/StorePage')));
const ProductPage = withLazyLoading(React.lazy(() => import('../pages/ProductPage')));
const BlogPage = withLazyLoading(React.lazy(() => import('../pages/BlogPage')));
const AboutPage = withLazyLoading(React.lazy(() => import('../pages/AboutPage')));
const ContactPage = withLazyLoading(React.lazy(() => import('../pages/ContactPage')));
const ServicesPage = withLazyLoading(React.lazy(() => import('../pages/ServicesPage')));
const TestimonialsPage = withLazyLoading(React.lazy(() => import('../pages/TestimonialsPage')));

const AppRoutes: React.FC = () => {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tienda" element={<StorePage />} />
        <Route path="/tienda/producto/:id" element={<ProductPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/sobre-nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/testimonios" element={<TestimonialsPage />} />
      </Routes>
    </PageTransition>
  );
};

export default AppRoutes;
