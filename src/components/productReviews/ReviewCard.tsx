import React from 'react';
// Use CSS transforms for interactive elements instead of framer-motion
import { OptimizedImage } from '../OptimizedImage';
import { Review } from './useProductReviews';

type Props = {
  review: Review;
  isHelpful: boolean;
  isReported: boolean;
  onToggleHelpful: (id: string) => void;
  onToggleReported: (id: string) => void;
};

export const ReviewCard: React.FC<Props> = ({
  review,
  isHelpful,
  isReported,
  onToggleHelpful,
  onToggleReported,
}) => (
  <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
        {review.userImage ? (
          <OptimizedImage
            src={review.userImage}
            alt={review.userName}
            className="object-cover"
            aspectRatio={1}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl text-gray-500">
              {review.userName.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center">
          <h3 className="font-semibold text-gray-800">{review.userName}</h3>
          {review.verified && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Compra verificada
            </span>
          )}
        </div>
        <div className="flex items-center mt-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            {new Date(review.date).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
    <p className="text-gray-600">{review.comment}</p>
    <div className="mt-4 flex items-center space-x-4">
      <button
        onClick={() => onToggleHelpful(review.id)}
        className={`text-sm flex items-center transform transition-transform duration-150 active:scale-95 ${
          isHelpful
            ? 'text-green-600 font-medium'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <svg
          className="w-4 h-4 mr-1"
          fill={isHelpful ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
        {isHelpful ? 'Marcado como útil' : 'Útil'}
        {review.helpfulCount && (
          <span className="ml-1 text-xs text-gray-500">
            ({review.helpfulCount + (isHelpful ? 1 : 0)})
          </span>
        )}
      </button>
      <button
        onClick={() => onToggleReported(review.id)}
        className={`text-sm transform transition-transform duration-150 active:scale-95 ${
          isReported
            ? 'text-red-600 font-medium'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {isReported ? 'Reportado' : 'Reportar'}
      </button>
    </div>
  </div>
);
