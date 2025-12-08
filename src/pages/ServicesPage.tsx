import React from 'react';
import { services } from '../data/services';
import { OptimizedImage } from '../components/OptimizedImage';
import { Service } from '../../types';
import { formatCurrency } from '../utils/intl';

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-emerald-50 py-16 md:py-24">
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
          {services.map((service: Service, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative h-48">
                <OptimizedImage
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full"
                  aspectRatio={1.5}
                  blur={true}
                />
                <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity duration-300" />
              </div>

              <div className="p-6 flex flex-col justify-center flex-grow">
                <h3 className="text-2xl font-bold text-green-700 font-display mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                {service.benefits && service.benefits.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-green-600 mb-2">
                      Beneficios:
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {service.benefits?.map((benefit: string, idx: number) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.price && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    {service.duration && (
                      <span className="text-gray-500 text-sm">
                        Duración: {service.duration} minutos
                      </span>
                    )}
                    <span className="text-green-700 font-bold">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
