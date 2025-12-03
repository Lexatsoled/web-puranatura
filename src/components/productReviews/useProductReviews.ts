import { useMemo, useState } from 'react';

export interface Review {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
  productId: string;
  verified: boolean;
  helpfulCount?: number;
}

export const useProductReviews = (reviews: Review[]) => {
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [reportedReviews, setReportedReviews] = useState<Set<string>>(
    new Set()
  );
  const [isWritingReview, setIsWritingReview] = useState(false);

  const averageRating = useMemo(
    () =>
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0,
    [reviews]
  );

  const toggleHelpful = (id: string) =>
    setHelpfulReviews((prev) => {
      const newSet = new Set(prev);
      if (prev.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });

  const toggleReported = (id: string) =>
    setReportedReviews((prev) => {
      const newSet = new Set(prev);
      if (prev.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });

  return {
    state: { helpfulReviews, reportedReviews, isWritingReview, averageRating },
    actions: { toggleHelpful, toggleReported, setIsWritingReview },
  };
};
