import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../types/product';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { validateProductForCart } from '../services/productHelpers';
import QuantitySelector from './QuantitySelector';

interface ProductActionsProps {
  product: Product;
  onMouseEnter?: () => void;
  className?: string;
  productId?: string;
}

/**
 * ProductActions - Componente especializado para acciones del producto (wishlist, carrito, cantidad)
 * @component
 * @param {object} props
 * @param {Product} props.product - Objeto producto
 * @param {() => void} [props.onMouseEnter] - Callback al hacer hover
 * @param {string} [props.className] - Clases CSS
 * @returns {JSX.Element}
 */
const ProductActions: React.FC<ProductActionsProps> = memo(
  ({ product, onMouseEnter, className = '', productId }) => {
    const { t } = useTranslation();
    const { addToCart, getItemQuantity } = useCartStore();
    const { toggleItem, isInWishlist } = useWishlistStore();

    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const handleAddToCart = useCallback(() => {
      const validation = validateProductForCart(product, selectedQuantity);

      if (!validation.isValid) {
        return;
      }

      addToCart(product, selectedQuantity);
  }, [addToCart, product, selectedQuantity]);

    const handleWishlistToggle = useCallback(() => {
      toggleItem(product);
    }, [toggleItem, product]);

    const isProductInWishlist = isInWishlist(product.id);
    const cartQuantity = getItemQuantity(product.id);
    const isOutOfStock = product.stock <= 0;

    return (
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 flex flex-col relative ${className}`}
        onMouseEnter={onMouseEnter}
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {t('common.new')}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {t('common.bestSeller')}
            </span>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {Math.round(
                ((product.compareAtPrice - product.price) /
                  product.compareAtPrice) *
                  100
              )}
              % OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {t('products.outOfStock')}
            </span>
          )}
        </div>

        {/* Botón de wishlist */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 z-20 ${
            isProductInWishlist
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
          title={
            isProductInWishlist
              ? 'Quitar de lista de deseos'
              : 'Agregar a lista de deseos'
          }
          aria-label={
            isProductInWishlist
              ? `Quitar ${product.name} de lista de deseos`
              : `Agregar ${product.name} a lista de deseos`
          }
          aria-pressed={!!isProductInWishlist}
        >
          <svg
            className="w-5 h-5"
            fill={isProductInWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Add to cart section with quantity selector */}
        <div className="p-4 space-y-2">
          {!isOutOfStock && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cantidad:</span>
              <QuantitySelector
                min={1}
                max={Math.min(3, product.stock)} // Máximo 3 o stock disponible
                value={selectedQuantity}
                onChange={setSelectedQuantity}
                size="sm"
                disabled={isOutOfStock}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-300 ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              aria-label={
                isOutOfStock
                  ? `${t('products.outOfStock')}`
                  : `${t('products.addToCart')} ${selectedQuantity} ${selectedQuantity === 1 ? 'unidad' : 'unidades'} de ${product.name}`
              }
              data-testid={productId ? `add-to-cart-btn-${productId}` : undefined}
            >
              {isOutOfStock
                ? t('products.outOfStock')
                : t('products.addToCart')}
            </button>

            {cartQuantity > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {cartQuantity} en carrito
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProductActions.displayName = 'ProductActions';

export default ProductActions;
