import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  blur?: boolean;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  aspectRatio,
  blur = true,
  priority = false,
}) => {
  // Calcular el placeholder blur como una versión muy pequeña de la imagen
  const placeholderSrc = `${src}?w=20&quality=10`;

  // Calcular diferentes tamaños para srcSet
  const sizes = [320, 640, 768, 1024, 1280, 1536];
  const srcSet = sizes
    .map((size) => `${src}?w=${size} ${size}w`)
    .join(', ');

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        aspectRatio: aspectRatio ? `${aspectRatio}` : 'auto',
      }}
    >
      <LazyLoadImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        effect={blur && !priority ? 'blur' : undefined}
        placeholderSrc={blur && !priority ? placeholderSrc : undefined}
        srcSet={srcSet}
        sizes="(max-width: 320px) 320px,
               (max-width: 640px) 640px,
               (max-width: 768px) 768px,
               (max-width: 1024px) 1024px,
               (max-width: 1280px) 1280px,
               1536px"
        className="w-full h-full object-cover"
        wrapperClassName="w-full h-full"
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};
