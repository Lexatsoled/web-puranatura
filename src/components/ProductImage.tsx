import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';
import OptimizedImage from './OptimizedImage';
import { generateSrcSet, PRODUCT_IMAGE_SIZES } from '../utils/image';

interface ProductImageProps {
  product: Product;
  onProductClick?: () => void;
  className?: string;
  priority?: boolean;
}

/**
 * ProductImage - Componente especializado para mostrar la imagen del producto
 * @component
 * @param {object} props
 * @param {Product} props.product - Objeto producto
 * @param {() => void} [props.onProductClick] - Callback al hacer click en la imagen
 * @param {string} [props.className] - Clases CSS
 * @returns {JSX.Element}
 * Maneja la lógica de prefetch, navegación y estados de stock
 */
const ProductImage: React.FC<ProductImageProps> = memo(
  ({ product, onProductClick, className = '', priority = false }) => {
    const cardImageUrl = useMemo(() => {
      if (!product.images || product.images.length === 0) {
        return '/placeholder-product.jpg'; // Imagen por defecto
      }
      return typeof product.images[0] === 'string'
        ? product.images[0]
        : product.images[0]?.full || '/placeholder-product.jpg';
    }, [product.images]);

    const responsiveSrcSet = useMemo(
      () => generateSrcSet(cardImageUrl),
      [cardImageUrl]
    );

    const isOutOfStock = product.stock <= 0;

    return (
      <Link
        to={`/tienda/producto/${product.id}`}
        onClick={onProductClick}
        className={`relative aspect-ratio-1-1 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center cursor-pointer block overflow-hidden group stable-layout ${className}`}
      >
        <div className="w-full h-full flex items-center justify-center p-4">
          <OptimizedImage
            src={cardImageUrl}
            alt={product.name}
            width="100%"
            height="100%"
            priority={priority}
            objectFit="contain"
            placeholder="blur"
            quality={80}
            srcSet={responsiveSrcSet}
            sizes={PRODUCT_IMAGE_SIZES}
            className={`transition-all duration-500 ease-in-out ${
              isOutOfStock
                ? 'opacity-50 grayscale'
                : 'group-hover:scale-110 group-hover:-rotate-1'
            }`}
          />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isOutOfStock
              ? 'bg-black bg-opacity-20'
              : 'bg-black bg-opacity-0 group-hover:bg-opacity-5'
          }`}
        ></div>
      </Link>
    );
  }
);

ProductImage.displayName = 'ProductImage';

export default ProductImage;
