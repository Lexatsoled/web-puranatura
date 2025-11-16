import React, { useState } from 'react';
import { Product } from '../types/product';
import QuantitySelector from './QuantitySelector';
import ProductImageGallery from './ProductImageGallery';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { calculateDiscountedPrice, formatPrice } from '../services/productHelpers';

interface ProductDetailsProps {
  product: Product;
}

/**
 * Componente ProductDetails para mostrar información detallada de un producto con accesibilidad y buenas prácticas.
 *
 * @component
 * @param {ProductDetailsProps} props - Props para ProductDetails
 * @returns {JSX.Element}
 */
const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlistToggle = () => {
    toggleItem(product);
  };

  const priceInfo = calculateDiscountedPrice(product);
  const formattedPrice = formatPrice(priceInfo.finalPrice);

  return (
    <div className="product-details" role="main" aria-label={`Detalles del producto ${product.name}`}> 
      <div className="product-gallery">
        <ProductImageGallery images={product.images as Array<{full: string; thumbnail?: string; alt?: string}>} />
      </div>
      <div className="product-info">
        <h1 className="product-title" id="product-title">{product.name}</h1>
        <p className="product-description" aria-labelledby="product-title">{product.description}</p>
        <div className="product-price" aria-label="Precio">
          {priceInfo.hasDiscount ? (
            <div className="price-discount">
              <span className="original-price" aria-label="Precio original">
                {formatPrice(priceInfo.originalPrice)}
              </span>
              <span className="final-price" aria-label="Precio final">{formattedPrice}</span>
              <span className="discount-badge" aria-label={`Descuento ${priceInfo.discount}%`}>
                {priceInfo.discount}% OFF
              </span>
            </div>
          ) : (
            <span className="price" aria-label="Precio">{formattedPrice}</span>
          )}
        </div>
        <div className="product-stock" aria-live="polite">
          <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
            {product.stock > 0 ? `En stock: ${product.stock}` : 'Agotado'}
          </span>
        </div>
        <div className="product-actions" role="group" aria-label="Acciones de producto">
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={product.stock}
          />
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="add-to-cart-btn"
            aria-label={product.stock > 0 ? 'Añadir al carrito' : 'Producto agotado'}
            title={product.stock > 0 ? 'Añadir al carrito' : 'Producto agotado'}
          >
            {product.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
          </button>
          <button
            onClick={handleWishlistToggle}
            className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
            aria-pressed={isInWishlist(product.id) ? "true" : "false"}
            aria-label={isInWishlist(product.id) ? 'Quitar de lista de deseos' : 'Añadir a lista de deseos'}
            title={isInWishlist(product.id) ? 'Quitar de lista de deseos' : 'Añadir a lista de deseos'}
          >
            {isInWishlist(product.id) ? '❤️ En lista de deseos' : '🤍 Añadir a lista de deseos'}
          </button>
        </div>
        {product.benefits && product.benefits.length > 0 && (
          <div className="product-benefits">
            <h3 id="beneficios-title">Beneficios</h3>
            <ul aria-labelledby="beneficios-title">
              {product.benefits.map((benefit, index) => (
                <li key={`benefit-${index}-${benefit}`}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="product-ingredients">
            <h3 id="ingredientes-title">Ingredientes</h3>
            <ul aria-labelledby="ingredientes-title">
              {product.ingredients.map((ingredient, index) => (
                <li key={`ingredient-${index}-${ingredient}`}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}
        {product.usage && (
          <div className="product-usage">
            <h3 id="uso-title">Modo de uso</h3>
            <p aria-labelledby="uso-title">{product.usage}</p>
          </div>
        )}
        {product.warnings && (
          <div className="product-warnings">
            <h3 id="advertencias-title">Advertencias</h3>
            <p aria-labelledby="advertencias-title">{product.warnings}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;