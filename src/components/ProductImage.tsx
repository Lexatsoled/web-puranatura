import React from 'react';
import { OptimizedImage } from './OptimizedImage';
import { ProductImage } from '../types';

interface ProductImageProps {
  image: ProductImage;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export const ProductImageComponent: React.FC<ProductImageProps> = ({
  image,
  className = '',
  priority = false,
  sizes = '(min-width: 1280px) 384px, (min-width: 1024px) 288px, (min-width: 768px) 342px, calc(100vw - 32px)',
}) => {
  return (
    <OptimizedImage
      src={image.full}
      alt={image.alt || ''}
      className={className}
      aspectRatio={1}
      blur={true}
      priority={priority}
      sizes={sizes}
    />
  );
};

export default ProductImageComponent;
