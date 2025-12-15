import React from 'react';
// Use CSS transitions for simple mount/hover effects to avoid framer-motion.
import { OptimizedImage } from '../OptimizedImage';

type Props = {
  images: { full: string; thumbnail: string }[];
  productName: string;
  selectedIndex: number;
  onOpen: () => void;
};

export const ImageGalleryMain: React.FC<Props> = ({
  images,
  productName,
  selectedIndex,
  onOpen,
}) => (
  <div
    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 transform hover:scale-101"
    onClick={onOpen}
    role="button"
    tabIndex={0}
    aria-label={`Ampliar imagen de ${productName}`}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onOpen();
    }}
  >
    <OptimizedImage
      src={images[selectedIndex]?.full}
      alt={productName}
      className="w-full h-full object-cover"
      aspectRatio={1}
    />
    <span className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
      Ver en grande
    </span>
  </div>
);
