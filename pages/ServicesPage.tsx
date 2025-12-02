import React from 'react';
import { services } from '../data/services';

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-emerald-50 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-green-800">
            Nuestros Servicios de Bienestar
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Descubre nuestra gama de terapias naturales disenadas para restaurar
            tu vitalidad y promover un estado de salud optimo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300"
            >
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-48 object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="p-6 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-green-700 font-display mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
