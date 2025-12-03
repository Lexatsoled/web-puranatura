import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ImageErrorFallback } from './optimizedImage/ErrorFallback';
import { ImagePlaceholder } from './optimizedImage/Placeholder';
import { OptimizedImageProps } from './optimizedImage/types';
import { useOptimizedImage } from './optimizedImage/useOptimizedImage';

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  aspectRatio,
  blur = true,
  priority = false,
  sizes,
  srcSet,
  onLoad,
  onError,
  objectFit = 'cover',
}) => {
  const {
    state: { isLoaded, hasError },
    dimensions: { finalWidth, finalHeight },
    resolvedSrcSet,
    resolvedSizes,
    effect,
    handlers: { handleLoad, handleError },
    imageStyle,
  } = useOptimizedImage({
    src,
    alt,
    width,
    height,
    className,
    aspectRatio,
    blur,
    priority,
    sizes,
    srcSet,
    onLoad,
    onError,
    objectFit,
  });

  if (hasError) {
    return (
      <ImageErrorFallback
        className={className}
        width={finalWidth}
        height={finalHeight}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <LazyLoadImage
        src={src}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        effect={effect}
        srcSet={resolvedSrcSet}
        sizes={resolvedSizes}
        afterLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={imageStyle}
        loading={priority ? 'eager' : 'lazy'}
      />

      {!isLoaded && !hasError && <ImagePlaceholder />}
    </div>
  );
};

const ImagePlaceholder = () => (
  <div
    className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
    style={{ zIndex: -1 }}
  >
    <svg
      className="w-6 h-6 text-gray-400"
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
  </div>
);

export default OptimizedImage;
