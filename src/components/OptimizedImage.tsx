import React, { useState, useCallback, useMemo } from 'react';
import {
  generateSrcSet,
  PRODUCT_IMAGE_SIZES,
  normalizeSrcSet,
} from '../utils/image';
import { getCDNUrl } from '../utils/cdn';

const SUPPORTED_FORMAT_REGEX = /\.(avif|webp|jpe?g|png)$/i;

const canSwapExtension = (value: string) => SUPPORTED_FORMAT_REGEX.test(value);

const swapExtension = (value: string, extension: string) => {
  if (!value) return value;
  if (!canSwapExtension(value)) {
    return value.includes('.') ? value : `${value}.${extension}`;
  }
  const [pathPart, query = ''] = value.split('?');
  const replaced = pathPart.replace(/\.[^.]+$/i, `.${extension}`);
  return `${replaced}${query ? `?${query}` : ''}`;
};

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
  placeholder?: 'blur' | 'empty';
  quality?: number;
}

/**
 * OptimizedImage - Imagen optimizada con soporte para lazy loading nativo.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  aspectRatio,
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

  const finalWidth = width || '100%';
  const finalHeight =
    height || (aspectRatio ? `${100 / aspectRatio}%` : '100%');

  const resolvedSrc = useMemo(() => getCDNUrl(src), [src]);
  // Generar URLs y srcsets para formatos modernos (siempre generar srcsets)
  const imageUrls = useMemo(() => {
    const avifSource = swapExtension(src, 'avif');
    const webpSource = swapExtension(src, 'webp');
    const avifSingle = getCDNUrl(avifSource);
    const webpSingle = getCDNUrl(webpSource);
    const jpegSingle = resolvedSrc;

    const avifSrcSet = normalizeSrcSet(
      generateSrcSet(avifSource)
    );
    const webpSrcSet = normalizeSrcSet(
      generateSrcSet(webpSource)
    );
    const jpegSrcSet = normalizeSrcSet(srcSet || generateSrcSet(src));

    return {
      // `getCDNUrl` and `generateSrcSet` now produce properly encoded paths
      // (segments encoded). Do not re-encode here to avoid double-encoding.
      avif: avifSingle || undefined,
      webp: webpSingle || undefined,
      jpeg: jpegSingle || undefined,
      avifSrcSet,
      webpSrcSet,
      jpegSrcSet,
    };
  }, [resolvedSrc, src, srcSet]);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className} w-full h-full`}
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
      <picture>
        {/* AVIF format - best compression */}
        <source
          srcSet={imageUrls.avifSrcSet || imageUrls.avif}
          sizes={sizes || PRODUCT_IMAGE_SIZES}
          type="image/avif"
        />
        {/* WebP format - widely supported */}
        <source
          srcSet={imageUrls.webpSrcSet || imageUrls.webp}
          sizes={sizes || PRODUCT_IMAGE_SIZES}
          type="image/webp"
        />
        {/* Fallback JPEG/PNG */}
        <img
          src={imageUrls.jpeg}
          alt={alt}
          srcSet={imageUrls.jpegSrcSet || undefined}
          sizes={sizes || PRODUCT_IMAGE_SIZES}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(priority && { fetchpriority: 'high' as any })}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit: objectFit as React.CSSProperties['objectFit'],
            width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
            height:
              typeof finalHeight === 'number'
                ? `${finalHeight}px`
                : finalHeight,
            transition: 'opacity 300ms ease',
            opacity: isLoaded ? 1 : 0,
            display: 'block',
          }}
        />
      </picture>

      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-0 w-full h-full">
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

export default OptimizedImage;

