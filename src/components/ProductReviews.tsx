import React from 'react';
import { motion } from 'framer-motion';
import { ReviewCard } from './productReviews/ReviewCard';
import { ReviewModal } from './productReviews/ReviewModal';
import { ReviewsSummary } from './productReviews/ReviewsSummary';
import { Review, useProductReviews } from './productReviews/useProductReviews';
import { ReviewFormData } from './ReviewForm';

interface ProductReviewsProps {
  reviews: Review[];
  onAddReview?: (review: ReviewFormData) => Promise<void>;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews,
  onAddReview,
}) => {
  const {
    state: { helpfulReviews, reportedReviews, isWritingReview, averageRating },
    actions: { toggleHelpful, toggleReported, setIsWritingReview },
  } = useProductReviews(reviews);

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <ReviewsSummary
            averageRating={averageRating}
            total={reviews.length}
          />
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isHelpful={helpfulReviews.has(review.id)}
              isReported={reportedReviews.has(review.id)}
              onToggleHelpful={toggleHelpful}
              onToggleReported={toggleReported}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsWritingReview(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Escribir una Reseña
          </motion.button>
        </div>

        <ReviewModal
          isOpen={isWritingReview}
          onClose={() => setIsWritingReview(false)}
          onSubmit={
            onAddReview
              ? async (review) => {
                  await onAddReview(review);
                }
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default ProductReviews;
