import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Product } from '../types/product';
import { calculateDiscountedPrice, calculateUnitPrice } from '../services/productHelpers';
import { useFormatting } from '../hooks/useFormatting';

interface ProductInfoProps {
  product: Product;
  onProductClick?: () => void;
  showPriceNote?: boolean;
}

/**
 * ProductInfo - Componente especializado para mostrar información del producto
 * @component
 * @param {object} props
 * @param {Product} props.product - Objeto producto
 * @param {() => void} [props.onProductClick] - Callback al hacer click en el producto
 * @param {boolean} [props.showPriceNote] - Mostrar nota de precio comparativo
 * @returns {JSX.Element}
 */
const ProductInfo: React.FC<ProductInfoProps> = memo(
  ({ product, onProductClick, showPriceNote = true }) => {
    const { t } = useTranslation();
    const { formatCurrency } = useFormatting();
    const isOutOfStock = product.stock <= 0;
    const hasDiscount =
      product.compareAtPrice && product.compareAtPrice > product.price;
    const priceInfo = calculateDiscountedPrice(product);
    const unitPrice = calculateUnitPrice(product);

    return (
      <div className="p-4 flex flex-col flex-grow">
        {/* Nombre del producto con link */}
        <Link
          to={`/tienda/producto/${product.id}`}
          onClick={onProductClick}
          className="text-lg font-semibold text-gray-800 truncate hover:text-green-600 transition-colors cursor-pointer"
          id={`product-title-${product.id}`}
          aria-describedby={`product-description-${product.id}`}
        >
          {product.name}
        </Link>

        {/* Categorías */}
        <p
          className="text-sm text-gray-500 mb-3"
          id={`product-description-${product.id}`}
        >
          {product.categories ? product.categories.join(', ') : ''}
        </p>

        {/* Stock info */}
        <div className="mb-2" aria-live="polite">
          {isOutOfStock ? (
            <p
              className="text-sm text-red-500 font-medium"
              aria-label={t('products.outOfStock')}
            >
              {t('products.outOfStock')}
            </p>
          ) : (
            <p
              className="text-sm text-green-500"
              aria-label={t('products.inStock', { count: product.stock })}
            >
              {t('products.inStock', { count: product.stock })}
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-green-700">
              {formatCurrency(priceInfo.finalPrice)}
            </p>
            {hasDiscount && (
              <p className="text-sm text-gray-400 line-through">
                {formatCurrency(priceInfo.originalPrice)}
              </p>
            )}
          </div>

          {/* Información adicional de precio */}
          {showPriceNote && unitPrice && (
            <p className="text-sm text-gray-600 mt-2">
              Información Precio Comparativo: La cápsula le sale a {unitPrice}
            </p>
          )}
        </div>
      </div>
    );
  }
);

ProductInfo.displayName = 'ProductInfo';

export default ProductInfo;
