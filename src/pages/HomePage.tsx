import React from 'react';
import { Link } from 'react-router-dom';
import { OptimizedBackgroundImage } from '../components/OptimizedBackgroundImage';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <OptimizedBackgroundImage
        src="/images/hero-background.jpg"
        className="h-[60vh] md:h-[80vh]"
        overlayClassName="bg-green-900 bg-opacity-50"
      >
        <div className="flex flex-col justify-center items-center h-full text-center text-white px-4">
          {/* Deterministic background panel to make contrast calculable by axe */}
          <div className="bg-green-900 p-6 rounded-md md:max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-4">
              Bienestar que Nace de la Tierra
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8">
              En PuraNatura, creemos en el poder curativo de la naturaleza para
              restaurar el equilibrio de tu cuerpo y mente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/servicios"
                className="bg-white text-green-800 font-semibold py-3 px-8 rounded-full hover:bg-green-100 transition-all duration-300 transform hover:scale-105"
              >
                Nuestros Servicios
              </Link>
              <Link
                to="/tienda"
                className="bg-green-700 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-800 transition-all duration-300 transform hover:scale-105"
              >
                Ir a la Tienda
              </Link>
            </div>
          </div>
        </div>
      </OptimizedBackgroundImage>

      {/* Featured Section */}
      <section className="py-20 bg-emerald-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold font-display text-green-800 mb-4">
            Tu Camino Hacia la Salud Holística
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Ofrecemos una gama de terapias naturales diseñadas para tratar a la
            persona en su totalidad, no solo los síntomas. Descubre un enfoque
            de salud que es a la vez suave y poderoso.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <FeatureCard
              title="Terapias Personalizadas"
              description="Planes de tratamiento únicos adaptados a tus necesidades específicas."
            />
            <FeatureCard
              title="Productos Naturales"
              description="Una selección cuidada de suplementos y remedios de la más alta calidad."
            />
            <FeatureCard
              title="Asesoramiento Experto"
              description="Guiado por profesionales apasionados por la salud natural."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="p-8 bg-white/50 border border-green-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <h3 className="text-2xl font-bold text-green-700 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;
