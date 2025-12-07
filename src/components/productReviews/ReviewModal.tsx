import React from 'react';
// Using simple conditional rendering and CSS transitions for the review modal
import ReviewForm, { ReviewFormData } from '../ReviewForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (review: ReviewFormData) => Promise<void>;
};

export const ReviewModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => (
  <>
    {isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg p-6 w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <ReviewForm
            onSubmit={async (review) => {
              if (onSubmit) await onSubmit(review);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    )}
  </>
);
