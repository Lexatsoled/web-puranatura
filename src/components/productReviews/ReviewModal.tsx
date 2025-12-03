import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReviewForm, { ReviewFormData } from '../ReviewForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (review: ReviewFormData) => Promise<void>;
};

export const ReviewModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
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
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
