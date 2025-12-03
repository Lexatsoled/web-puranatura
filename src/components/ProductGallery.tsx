import React from 'react';
import { ProductImage } from '../types/product';
import { useProductGallery } from './productGallery/useProductGallery';
import { GalleryMainImage } from './productGallery/GalleryMainImage';
import { GalleryThumbnails } from './productGallery/GalleryThumbnails';
import { GalleryModal } from './productGallery/GalleryModal';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  className = '',
}) => {
  const {
    selectedImage,
    isFullscreen,
    setIsFullscreen,
    setSelectedImage,
    nextImage,
    prevImage,
  } = useProductGallery(images);

  if (!images || images.length === 0) {
    return (
      <div
        className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}
      >
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <GalleryMainImage
        images={images}
        productName={productName}
        selectedImage={selectedImage}
        onClick={() => setIsFullscreen(true)}
      />

      {images.length > 1 && (
        <NavButtons onPrev={prevImage} onNext={nextImage} show={true} />
      )}

      <GalleryThumbnails
        images={images}
        selectedImage={selectedImage}
        onSelect={setSelectedImage}
        productName={productName}
      />

      <GalleryModal
        isOpen={isFullscreen}
        images={images}
        selectedImage={selectedImage}
        onClose={() => setIsFullscreen(false)}
        onPrev={prevImage}
        onNext={nextImage}
        productName={productName}
      />
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center text-gray-500">
    <svg
      className="h-12 w-12 mx-auto mb-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <p>Sin imágenes disponibles</p>
  </div>
);

const NavButtons = ({
  onPrev,
  onNext,
  show,
}: {
  onPrev: () => void;
  onNext: () => void;
  show: boolean;
}) =>
  show ? (
    <div className="flex justify-between">
      <button
        onClick={onPrev}
        className="p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow"
        aria-label="Imagen anterior"
      >
        <Arrow direction="left" />
      </button>
      <button
        onClick={onNext}
        className="p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow"
        aria-label="Imagen siguiente"
      >
        <Arrow direction="right" />
      </button>
    </div>
  ) : null;

const Arrow = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
    />
  </svg>
);

export default ProductGallery;
