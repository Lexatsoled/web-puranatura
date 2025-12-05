import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface OptimizedBackgroundImageProps {
  src: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  minHeight?: string;
  priority?: 'high' | 'low' | 'auto';
  aspectRatio?: string;
}

export const OptimizedBackgroundImage: React.FC<
  OptimizedBackgroundImageProps
> = ({
  src,
  children,
  className = '',
  overlayClassName = '',
  minHeight = '60vh',
  priority = 'auto',
  aspectRatio = '16 / 9',
}) => {
  const loading = priority === 'high' ? 'eager' : 'lazy';
  const fetchPriority = priority;

  return (
    <div
      className={`relative ${className}`}
      style={{ minHeight, aspectRatio }}
      aria-hidden="true"
    >
      {priority === 'high' ? (
        // Para LCP: renderiza imagen directa, sin lazy, con prioridad alta
        <img
          src={src}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
      ) : (
        <LazyLoadImage
          src={src}
          effect="blur"
          className="absolute inset-0 w-full h-full object-cover"
          wrapperClassName="absolute inset-0"
          loading={loading}
          fetchPriority={fetchPriority}
          placeholder={
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          }
        />
      )}
      <div className={`relative z-10 ${overlayClassName}`}>{children}</div>
    </div>
  );
};
