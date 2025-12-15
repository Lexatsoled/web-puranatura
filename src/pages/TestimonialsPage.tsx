import React from 'react';
import { testimonials } from '../data/testimonials';
import OptimizedImage from '../components/OptimizedImage';

const TestimonialsPage: React.FC = () => {
  return (
    <div className="bg-emerald-50 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-green-800">
            Lo que dicen nuestros clientes
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Historias reales de personas que han encontrado bienestar y
            equilibrio con nosotros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm p-8 rounded-lg shadow-md"
            >
              <p className="text-gray-700 italic mb-6 text-lg">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                {testimonial.imageUrl && (
                  <OptimizedImage
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mr-4 object-cover"
                    width={56}
                    height={56}
                  />
                )}
                <div className={!testimonial.imageUrl ? 'ml-2' : ''}>
                  <p className="font-bold text-green-800">{testimonial.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
