import React from 'react';
// Use CSS based overlay and modal transitions instead of framer-motion
import { OptimizedImage } from '../OptimizedImage';

type Props = {
  images: { full: string; thumbnail: string }[];
  productName: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
};

export const ImageGalleryModal: React.FC<Props> = ({
  images,
  productName,
  selectedIndex,
  onSelect,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full transform transition-transform duration-200 scale-100">
      <div className="relative">
        <OptimizedImage
          src={images[selectedIndex]?.full}
          alt={productName}
          className="w-full h-full object-cover"
          aspectRatio={1}
        />
        <button
          className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
      <div className="p-4">
        <ImageGalleryThumbs
          images={images}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
        />
      </div>
      </div>
    </div>
);

const ImageGalleryThumbs = ({
  images,
  selectedIndex,
  onSelect,
}: {
  images: { full: string; thumbnail: string }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) => (
  <div className="flex space-x-2 overflow-x-auto">
    {images.map((img, index) => (
      <button
        key={`${img.thumbnail}-${index}`}
        onClick={() => onSelect(index)}
        className={`w-16 h-16 rounded-lg overflow-hidden border ${
          selectedIndex === index ? 'border-green-500' : 'border-transparent'
        }`}
      >
        <OptimizedImage
          src={img.thumbnail}
          alt={`Miniatura ${index + 1}`}
          className="w-full h-full object-cover"
          aspectRatio={1}
        />
      </button>
    ))}
  </div>
);
