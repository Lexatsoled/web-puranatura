import React, { useState, useCallback } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  aspectRatio?: number;
  blur?: boolean;
  priority?: boolean;
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

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

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  React.useEffect(() => {
    // Only import CSS in browser context; avoids Node import error when running Playwright tests
    if (typeof window !== 'undefined') {
      import('react-lazy-load-image-component/src/effects/blur.css').catch(
        () => {}
      );
    }
  }, []);

  // Calcular dimensiones basadas en aspectRatio
  const finalWidth = width || '100%';
  const finalHeight =
    height || (aspectRatio ? `${100 / aspectRatio}%` : '100%');

  // Generar srcSet automático si no se proporciona
  const autoSrcSet = srcSet || awaitImportSrcSet(src);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: finalWidth, height: finalHeight }}
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
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <LazyLoadImage
        src={src}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        effect={blur && !priority ? 'blur' : undefined}
        srcSet={autoSrcSet}
        sizes={
          sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        }
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

      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
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
      )}
    </div>
  );
};

// NOTE: srcset generation moved to src/utils/imageUtils and is imported via
// awaitImportSrcSet at runtime to avoid SSR bundling issues. Local helper
// removed to avoid duplication and unused symbol warnings.

// small indirection to avoid bundling issues during SSR tests
function awaitImportSrcSet(src: string) {
  // Import on demand for consistency with previous approach
  try {
    // require the util synchronously (it's local file) — keeping it simple

    const { generateSrcSet } = require('../utils/imageUtils');
    return generateSrcSet(src);
  } catch {
    return '';
  }
}

export default OptimizedImage;
