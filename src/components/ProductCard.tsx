import React, { memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { usePrefetchImage } from '../hooks/usePrefetch';
import QuantitySelector from './QuantitySelector';
import OptimizedImage from './OptimizedImage';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
}) => {
  const addToCart = useCartStore(state => state.addToCart);
  const getItemQuantity = useCartStore(state => state.getItemQuantity);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { prefetchImages } = usePrefetchImage();

  const handleAddToCart = useCallback(() => {
    addToCart(product, selectedQuantity);
  }, [addToCart, product, selectedQuantity]);

  const handleWishlistToggle = useCallback(() => {
    toggleItem(product);
  }, [toggleItem, product]);

  // Función para actualizar scroll position antes de navegar al producto
  const handleProductClick = useCallback(() => {
    // Actualizar la posición de scroll en sessionStorage antes de navegar
    const STORAGE_KEY = 'puranatura_navigation_state';
    const savedState = sessionStorage.getItem(STORAGE_KEY);
    
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        state.scrollPosition = window.scrollY;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, []);

  // Prefetch de todas las imágenes del producto cuando el usuario hace hover
  const handleMouseEnter = useCallback(() => {
    // Precargar todas las imágenes del producto para la página de detalle
    const imagesToPrefetch = product.images.map(img => 
      typeof img === 'string' ? img : img.full
    );
    prefetchImages(imagesToPrefetch);
  }, [product.images, prefetchImages]);

  const cardImageUrl = typeof product.images[0] === 'string' ? 
    product.images[0] : 
    product.images[0].full;
  const isProductInWishlist = isInWishlist(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
      onMouseEnter={handleMouseEnter}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Nuevo
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Más Vendido
          </span>
        )}
        {hasDiscount && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}% OFF
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Agotado
          </span>
        )}
      </div>

      {/* Imagen con link - Solo la imagen es clickeable */}
      <Link 
        to={`/producto/${product.id}`}
        onClick={handleProductClick}
        className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center cursor-pointer block overflow-hidden group"
      >
        <div className="w-full h-full flex items-center justify-center p-4">
          <OptimizedImage
            src={cardImageUrl}
            alt={product.name}
            height={256}
            useWebP={true}
            priority={false}
            objectFit="contain"
            className={`max-w-full max-h-full transition-all duration-500 ease-in-out ${
              isOutOfStock 
                ? 'opacity-50 grayscale' 
                : 'group-hover:scale-110 group-hover:-rotate-1'
            }`}
          />
        </div>
        <div className={`absolute inset-0 transition-all duration-300 ${
          isOutOfStock 
            ? 'bg-black bg-opacity-20' 
            : 'bg-black bg-opacity-0 group-hover:bg-opacity-5'
        }`}></div>
      </Link>

      {/* Botón de wishlist - Fuera del link */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 z-20 ${
          isProductInWishlist 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
        }`}
        title={isProductInWishlist ? 'Quitar de lista de deseos' : 'Agregar a lista de deseos'}
      >
        <svg className="w-5 h-5" fill={isProductInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      
      <div className="p-4 flex flex-col flex-grow">
        {/* Nombre del producto con link - Solo el nombre es clickeable */}
        <Link 
          to={`/producto/${product.id}`}
          onClick={handleProductClick}
          className="text-lg font-semibold text-gray-800 truncate hover:text-green-600 transition-colors cursor-pointer"
        >
          {product.name}
        </Link>
        <p className="text-sm text-gray-500 mb-3">
          {product.categories ? product.categories.join(', ') : ''}
        </p>
        
        {/* Stock info - Solo mostrar disponibilidad general */}
        <div className="mb-2">
          {isOutOfStock ? (
            <p className="text-sm text-red-500 font-medium">Agotado</p>
          ) : (
            <p className="text-sm text-green-500">En stock</p>
          )}
        </div>

        <div className="mt-auto">
          {/* Pricing */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-green-700">
                DOP ${product.price.toFixed(2)}
              </p>
              {hasDiscount && (
                <p className="text-sm text-gray-400 line-through">
                  DOP ${product.compareAtPrice!.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Add to cart section with quantity selector */}
          <div className="space-y-2">
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cantidad:</span>
                <QuantitySelector
                  min={1}
                  max={3}
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
              >
                {isOutOfStock ? 'Agotado' : `Añadir ${selectedQuantity > 1 ? `(${selectedQuantity})` : ''}`}
              </button>
              
              {cartQuantity > 0 && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {cartQuantity} en carrito
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
