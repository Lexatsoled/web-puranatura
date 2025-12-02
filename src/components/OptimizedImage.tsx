import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type RequiredImageProps = {
  src: string;
  alt: string;
};

type OptionalImageProps = {
  width: number | string;
  height: number | string;
  className: string;
  aspectRatio: number;
  blur: boolean;
  priority: boolean;
  sizes: string;
  srcSet: string;
  onLoad: () => void;
  onError: () => void;
  objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
};

type OptimizedImageProps = RequiredImageProps & Partial<OptionalImageProps>;

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Solo importa el CSS en navegador para evitar errores en pruebas SSR/Playwright.
    if (typeof window !== 'undefined') {
      import('react-lazy-load-image-component/src/effects/blur.css').catch(
        () => {}
      );
    }
  }, []);

  const { finalWidth, finalHeight } = useMemo(
    () => ({
      finalWidth: width || '100%',
      finalHeight: height || (aspectRatio ? `${100 / aspectRatio}%` : '100%'),
    }),
    [aspectRatio, height, width]
  );

  const resolvedSrcSet = useMemo(() => {
    if (srcSet) return srcSet;
    try {
      const { generateSrcSet } = require('../utils/imageUtils');
      return generateSrcSet(src);
    } catch {
      return '';
    }
  }, [src, srcSet]);

  const resolvedSizes =
    sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  const effect = blur && !priority ? 'blur' : undefined;

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    if (onError) {
      onError();
    }
  }, [onError]);

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
        style={{
          objectFit,
          width: '100%',
          height: '100%',
        }}
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

type FallbackProps = Pick<
  OptimizedImageProps,
  'className' | 'width' | 'height'
>;

const ImageErrorFallback = ({ className, width, height }: FallbackProps) => (
  <div
    className={`bg-gray-200 flex items-center justify-center ${className}`}
    style={{ width, height }}
  >
    <svg
      className="w-8 h-8 text-gray-400"
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
