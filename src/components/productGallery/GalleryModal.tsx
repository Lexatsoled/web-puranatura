// Replace framer-motion modal transitions with CSS-based transitions
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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-200"
      onClick={onClose}
    >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
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
          className="max-w-full max-h-full object-contain p-4 transition-transform duration-200 transform-gpu scale-100"
          onClick={(e) => e.stopPropagation()}
        />

        {images.length > 1 && (
          <>
            <ArrowButton position="left" onClick={onPrev} />
            <ArrowButton position="right" onClick={onNext} />
          </>
        )}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
          {selectedImage + 1} de {images.length}
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
