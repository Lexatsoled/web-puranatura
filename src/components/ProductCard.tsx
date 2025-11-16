import React, { memo, useCallback } from 'react';
import { Product } from '../types/product';
import { usePrefetchImage } from '../hooks/usePrefetch';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import ProductActions from './ProductActions';

interface ProductCardProps {
  product: Product;
  prioritizeImage?: boolean;
}

/**
 * ProductCard - Tarjeta de producto con imagen, info y acciones.
 * Controla el prefetch y los eventos asociados a la navegación.
 */
const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product, prioritizeImage = false }) => {
    const { prefetchImages } = usePrefetchImage();

    const handleProductClick = useCallback(() => {
      const STORAGE_KEY = 'puranatura_navigation_state';
      const savedState = sessionStorage.getItem(STORAGE_KEY);

      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          state.scrollPosition = window.scrollY;
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
          if (import.meta.env.DEV) {
            import('../services/errorLogger').then(
              ({ errorLogger, ErrorSeverity, ErrorCategory }) => {
                errorLogger.log(
                  error instanceof Error ? error : new Error(String(error)),
                  ErrorSeverity.LOW,
                  ErrorCategory.NAVIGATION,
                  {
                    context: 'ProductCard',
                    message: 'Error al parsear navigation state',
                  }
                );
              }
            );
          }
        }
      }
    }, []);

    const handleMouseEnter = useCallback(() => {
      const imagesToPrefetch = product.images.map((img) =>
        typeof img === 'string' ? img : img.full
      );
      prefetchImages(imagesToPrefetch);
    }, [product.images, prefetchImages]);

    return (
      <article
        className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
        role="article"
        aria-labelledby={`product-title-${product.id}`}
        aria-describedby={`product-description-${product.id}`}
        data-testid={`product-card-${product.id}`}
      >
        <ProductImage
          product={product}
          onProductClick={handleProductClick}
          priority={prioritizeImage}
        />

        <ProductInfo product={product} onProductClick={handleProductClick} />

        <ProductActions product={product} onMouseEnter={handleMouseEnter} productId={product.id} />
      </article>
    );
  }
);

ProductCard.displayName = 'ProductCard';
export default ProductCard;
