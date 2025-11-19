import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface OptimizedBackgroundImageProps {
  src: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

export const OptimizedBackgroundImage: React.FC<
  OptimizedBackgroundImageProps
> = ({ src, children, className = '', overlayClassName = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <LazyLoadImage
        src={src}
        effect="blur"
        className="absolute inset-0 w-full h-full object-cover"
        wrapperClassName="absolute inset-0"
        placeholder={
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        }
      />
      <div className={`relative z-10 ${overlayClassName}`}>{children}</div>
    </div>
  );
};
