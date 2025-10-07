import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../data/services';

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-emerald-100 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-green-800">
            Nuestros Servicios de Bienestar
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Descubre nuestra gama de terapias naturales diseñadas para restaurar
            tu vitalidad y promover un estado de salud óptimo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              to={`/servicios/${service.id}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {service.category}
                </div>
              </div>
              <div className="p-6 flex flex-col justify-center flex-grow">
                <h3 className="text-2xl font-bold text-green-700 font-display mb-2 group-hover:text-green-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 flex-grow">
                  {service.description}
                </p>
                
                {/* Service Info */}
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>⏱️ {service.duration} min</span>
                  <span className="font-semibold text-green-600">DOP ${service.price.toFixed(2)}</span>
                </div>
                
                {/* Benefits Preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {service.benefits.slice(0, 2).map((benefit, index) => (
                    <span
                      key={index}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                  {service.benefits.length > 2 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      +{service.benefits.length - 2} más
                    </span>
                  )}
                </div>
                
                <span className="font-semibold text-green-600 hover:text-green-800 transition-colors duration-300 self-start mt-auto">
                  Ver detalles &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
