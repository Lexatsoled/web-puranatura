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

export const generateImageUrl = (
  url: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg';
  }
) => {
  const params = new URLSearchParams();

  if (options.width) {
    params.append('w', options.width.toString());
  }

  if (options.quality) {
    params.append('q', options.quality.toString());
  }

  if (options.format) {
    params.append('f', options.format);
  }

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};
