import { useState, useEffect } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
}

export const useImageDimensions = (src: string): ImageDimensions | null => {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    const handleLoad = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.addEventListener('load', handleLoad);

    return () => {
      img.removeEventListener('load', handleLoad);
    };
  }, [src]);

  return dimensions;
};

export { generateImageUrl } from '../utils/imageUrl';
