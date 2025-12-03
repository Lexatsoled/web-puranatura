import React from 'react';
import { OptimizedImage } from '../OptimizedImage';

type Props = {
  images: { full: string; thumbnail: string }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export const ImageGalleryThumbs: React.FC<Props> = ({
  images,
  selectedIndex,
  onSelect,
}) => (
  <div className="flex space-x-3 overflow-x-auto pb-2">
    {images.map((img, index) => (
      <button
        key={img.thumbnail}
        onClick={() => onSelect(index)}
        className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
          selectedIndex === index ? 'border-green-500' : 'border-transparent'
        }`}
      >
        <OptimizedImage
          src={img.thumbnail}
          alt={`Thumbnail ${index + 1}`}
          className="w-full h-full object-cover"
          aspectRatio={1}
        />
      </button>
    ))}
  </div>
);
