import { useCallback, useEffect, useMemo, useState } from 'react';
import { OptimizedImageProps } from './types';
import { computeDimensions, resolveSrcSet } from './imageCalculations';
import { loadBlurCss } from './imageEnv';

const DEFAULT_SIZES =
  '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

export const useOptimizedImage = ({
  width,
  height,
  aspectRatio,
  blur,
  priority,
  sizes,
  src,
  srcSet,
  onLoad,
  onError,
  objectFit,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(loadBlurCss, []);

  const dimensions = useMemo(
    () => computeDimensions(width, height, aspectRatio),
    [aspectRatio, height, width]
  );

  const resolvedSrcSet = useMemo(
    () => resolveSrcSet(src, srcSet),
    [src, srcSet]
  );

  const resolvedSizes = sizes || DEFAULT_SIZES;
  const effect = blur && !priority ? 'blur' : undefined;

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const imageStyle = useMemo(
    () => ({
      objectFit: objectFit || 'cover',
      width: '100%',
      height: '100%',
    }),
    [objectFit]
  );

  return {
    state: { isLoaded, hasError },
    dimensions,
    resolvedSrcSet,
    resolvedSizes,
    effect,
    handlers: { handleLoad, handleError },
    imageStyle,
  };
};
