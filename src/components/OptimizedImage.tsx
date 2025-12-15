import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ImageErrorFallback } from './optimizedImage/ErrorFallback';
import { ImagePlaceholder } from './optimizedImage/Placeholder';
import { OptimizedImageProps } from './optimizedImage/types';
import { useOptimizedImage } from './optimizedImage/useOptimizedImage';
import { DEFAULT_PRODUCT_IMAGE } from '@/src/constants/images';

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
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: aspectRatio ? `${aspectRatio}` : undefined }}
    >
      <LazyLoadImage
        src={src ?? DEFAULT_PRODUCT_IMAGE}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        effect={effect as any}
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

export default OptimizedImage;
