import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OptimizedBackgroundImage } from '@/components/OptimizedBackgroundImage';
import ProductCard from '@/components/ProductCard';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useProductStore } from '@/store/productStore';
import { errorLogger, ErrorCategory, ErrorSeverity } from '@/services/errorLogger';
import { SEOHead } from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/utils/structuredData';

const HomePage: React.FC = () => {
  useScrollToTop();

  const featuredProducts = useProductStore((state) => state.featured);
  const fetchFeatured = useProductStore((state) => state.fetchFeatured);
  const loading = useProductStore((state) => state.loading);

  useEffect(() => {
    fetchFeatured().catch((error) => {
      errorLogger.log(
        error instanceof Error ? error : new Error(String(error)),
        ErrorSeverity.MEDIUM,
        ErrorCategory.API,
        { context: 'HomePage', action: 'fetchFeatured' }
      );
    });

    import('@/pages/StorePage').catch(() => {
      // Preload best effort
    });
  }, [fetchFeatured]);

  return (
    <div>
      <SEOHead
        title="Inicio - Bienestar Natural"
        description="Pureza Naturalis ofrece terapias naturales y productos de alta calidad para restaurar el equilibrio de tu cuerpo y mente. Descubre el poder curativo de la naturaleza."
        canonical="https://purezanaturalis.com/"
        type="website"
        jsonLd={[generateOrganizationSchema(), generateWebsiteSchema()]}
      />
      
      <OptimizedBackgroundImage
        src="/images/hero-background.webp"
        alt="Fondo de la sección principal con elementos naturales"
        className="h-[60vh] md:h-[80vh]"
        overlayClassName="bg-primary bg-opacity-80"
      >
        <div className="flex flex-col justify-center items-center h-full text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-4 text-gray-100">
            Bienestar que nace de la tierra
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 text-gray-100">
            En Pureza Naturalis, creemos en el poder curativo de la naturaleza para restaurar el equilibrio de tu cuerpo y mente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/servicios"
              className="bg-white text-primary font-semibold py-3 px-8 rounded-full hover:bg-green-100 transition-all duration-300 transform hover:scale-105"
            >
              Nuestros servicios
            </Link>
            <Link
              to="/tienda"
              className="bg-primary text-white font-semibold py-3 px-8 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              Ir a la tienda
            </Link>
          </div>
        </div>
      </OptimizedBackgroundImage>

      <section className="py-20 bg-emerald-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold font-display text-green-700 mb-4">
            Productos destacados
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Fórmulas cuidadosamente seleccionadas por nuestros expertos en salud natural.
          </p>

          {loading && featuredProducts.length === 0 ? (
            <div className="py-10 flex justify-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Pronto añadiremos nuestros productos favoritos en esta sección.
            </p>
          )}
        </div>
      </section>

      <section className="py-20 bg-emerald-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold font-display text-green-800 mb-4">
            Tu camino hacia la salud holística
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Ofrecemos una gama de terapias naturales diseñadas para tratar a la persona en su totalidad, no solo los síntomas. Descubre un enfoque de salud que es a la vez suave y poderoso.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Terapias personalizadas"
              description="Planes de tratamiento únicos adaptados a tus necesidades específicas."
            />
            <FeatureCard
              title="Productos naturales"
              description="Una selección cuidada de suplementos y remedios de la más alta calidad."
            />
            <FeatureCard
              title="Asesoramiento experto"
              description="Guiado por profesionales apasionados por la salud natural."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="p-8 bg-white/50 border border-green-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <h3 className="text-2xl font-bold text-green-700 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;
