import React from 'react';
import { OptimizedImage } from './OptimizedImage';

export interface NavigationControlsProps {
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onClose: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrev,
  onNext,
  onClose,
}) => (
  <>
    <button
      onClick={onPrev}
      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
    >
      ←
    </button>
    <button
      onClick={onNext}
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors"
    >
      →
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors"
    >
      ✕
    </button>
  </>
);

export interface ThumbnailGridProps {
  images: string[];
  selectedImage: number;
  onSelect: (index: number) => void;
  alt: string;
}

export const ThumbnailGrid: React.FC<ThumbnailGridProps> = ({
  images,
  selectedImage,
  onSelect,
  alt,
}) => (
  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
    {images.map((image, index) => (
      <button
        key={index}
        onClick={() => onSelect(index)}
        aria-label={`Ver imagen ${index + 1}: ${alt}`}
        className={`relative aspect-video rounded-md overflow-hidden ${
          selectedImage === index
            ? 'ring-2 ring-green-500'
            : 'ring-1 ring-gray-200'
        }`}
      >
        <OptimizedImage
          src={image}
          alt={`${alt} - Miniatura ${index + 1}`}
          className="w-full h-full"
          aspectRatio={16 / 9}
          blur={true}
        />
      </button>
    ))}
  </div>
);

export const GalleryMainImage: React.FC<{
  image: string;
  alt: string;
  isZoomed: boolean;
  onImageClick: () => void;
  showControls: boolean;
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onClose: () => void;
}> = ({
  image,
  alt,
  isZoomed,
  onImageClick,
  showControls,
  onPrev,
  onNext,
  onClose,
}) => {
  const containerClass = `relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
    isZoomed ? 'fixed inset-0 z-50 bg-black/90 p-4' : ''
  }`;
  const imageClass = `w-full h-full ${
    isZoomed ? 'object-contain' : 'object-cover'
  }`;

  return (
    <div
      className={containerClass}
      onClick={onImageClick}
      role="button"
      tabIndex={0}
      aria-label={isZoomed ? 'Cerrar zoom' : 'Ampliar imagen'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onImageClick();
        }
      }}
    >
      <OptimizedImage
        src={image}
        alt={alt}
        className={imageClass}
        aspectRatio={isZoomed ? undefined : 16 / 9}
        blur={true}
      />

      {showControls && (
        <NavigationControls onPrev={onPrev} onNext={onNext} onClose={onClose} />
      )}
    </div>
  );
};
