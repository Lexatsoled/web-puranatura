import React from 'react';

export type RequiredImageProps = {
  src: string;
  alt: string;
};

export type OptionalImageProps = {
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

export type OptimizedImageProps = RequiredImageProps &
  Partial<OptionalImageProps> & { children?: React.ReactNode };
