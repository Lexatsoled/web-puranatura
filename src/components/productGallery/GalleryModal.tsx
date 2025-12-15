// Replace framer-motion modal transitions with CSS-based transitions
import React from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { ProductImage } from '../../types/product';

export const GalleryModal = ({
  isOpen,
  images,
  selectedImage,
  onClose,
  onPrev,
  onNext,
  productName,
}: {
  isOpen: boolean;
  images: ProductImage[];
  selectedImage: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  productName: string;
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const bgRef = React.useRef<HTMLButtonElement>(null);
  useFocusTrap(modalRef, {
    isActive: isOpen,
    onEscape: onClose,
    initialFocusRef: bgRef,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        ref={bgRef}
        type="button"
        className="absolute inset-0 w-full h-full bg-black/90 cursor-default"
        onClick={onClose}
        aria-label="Cerrar galería"
      />
      <div
        ref={modalRef}
        className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 pointer-events-auto"
          aria-label="Cerrar pantalla completa"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <img
          src={images[selectedImage]?.full || images[selectedImage]?.thumbnail}
          alt={`${productName} - Imagen ${selectedImage + 1}`}
          className="max-w-full max-h-full object-contain p-4 transition-transform duration-200 transform-gpu scale-100 pointer-events-auto"
        />

        {images.length > 1 && (
          <div className="pointer-events-auto">
            <ArrowButton position="left" onClick={onPrev} />
            <ArrowButton position="right" onClick={onNext} />
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm pointer-events-auto">
          {selectedImage + 1} de {images.length}
        </div>
      </div>
    </div>
  );
};

const ArrowButton = ({
  position,
  onClick,
}: {
  position: 'left' | 'right';
  onClick: (e: React.MouseEvent) => void;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick(e);
    }}
    className={`absolute ${position === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300`}
    aria-label={position === 'left' ? 'Imagen anterior' : 'Imagen siguiente'}
  >
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={position === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
      />
    </svg>
  </button>
);
