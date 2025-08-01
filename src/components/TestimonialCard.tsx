import React from 'react';
import { OptimizedImage } from './OptimizedImage';
import { Testimonial } from '../types/services';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm p-8 rounded-lg shadow-md transform hover:-translate-y-1 transition-all duration-300">
      {/* Rating Stars */}
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < testimonial.rating
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <p className="text-gray-700 italic mb-6 text-lg">{testimonial.text}</p>

      <div className="flex items-center">
        {testimonial.imageUrl && (
          <div className="mr-4 w-14 h-14 rounded-full overflow-hidden">
            <OptimizedImage
              src={testimonial.imageUrl}
              alt={testimonial.name}
              className="w-full h-full"
              aspectRatio={1}
              blur={true}
            />
          </div>
        )}
        <div className={!testimonial.imageUrl ? 'ml-2' : ''}>
          <p className="font-bold text-green-800">{testimonial.name}</p>
          <p className="text-sm text-gray-600">
            {new Date(testimonial.date).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
