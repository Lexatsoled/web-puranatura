import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[60vh] md:h-[80vh] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://picsum.photos/id/1018/1600/900')",
        }}
      >
        <div className="absolute inset-0 bg-green-900 bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-4">
            Bienestar que Nace de la Tierra
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            En PuraNatura, creemos en el poder curativo de la naturaleza para
            restaurar el equilibrio de tu cuerpo y mente.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/servicios"
              className="bg-white text-green-800 font-semibold py-3 px-8 rounded-full hover:bg-green-100 transition-all duration-300 transform hover:scale-105"
            >
              Nuestros Servicios
            </Link>
            <Link
              to="/tienda"
              className="bg-green-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              Ir a la Tienda
            </Link>
          </div>
        </div>
      </section>

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
            <div className="p-8 bg-white/50 border border-green-100 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-green-700 mb-2">
                Terapias Personalizadas
              </h3>
              <p className="text-gray-600">
                Planes de tratamiento únicos adaptados a tus necesidades
                específicas.
              </p>
            </div>
            <div className="p-8 bg-white/50 border border-green-100 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-green-700 mb-2">
                Productos Naturales
              </h3>
              <p className="text-gray-600">
                Una selección cuidada de suplementos y remedios de la más alta
                calidad.
              </p>
            </div>
            <div className="p-8 bg-white/50 border border-green-100 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-green-700 mb-2">
                Asesoramiento Experto
              </h3>
              <p className="text-gray-600">
                Guiado por profesionales apasionados por la salud natural.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
