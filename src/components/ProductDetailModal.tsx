import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import useProductDetail from '../hooks/useProductDetail';
import { ProductDetailGallery } from './productDetail/ProductDetailGallery';
import { ProductDetailInfo } from './productDetail/ProductDetailInfo';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCartSuccess?: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCartSuccess,
}) => {
  const { addToCart } = useCartStore();

  const {
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    isZoomed,
    setIsZoomed,
    mousePosition,
    isAddingToCart,
    handleMouseMove,
    handleAddToCart,
  } = useProductDetail({ product, isOpen, onClose, addToCart });

  // Keep this component simple: animate only on mount with CSS classes.
  // We remove framer-motion so the runtime won't be pulled into shared chunks.
  if (!isOpen) return null;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const onAddAndClose = async () => {
    await handleAddToCart();
    onAddToCartSuccess?.();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-200 ${
          mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
            <div className="grid md:grid-cols-2 h-full">
              <ProductDetailGallery
                product={product}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                isZoomed={isZoomed}
                setIsZoomed={setIsZoomed}
                mousePosition={mousePosition}
                onMouseMove={handleMouseMove}
              />

              <ProductDetailInfo
                product={product}
                quantity={quantity}
                setQuantity={setQuantity}
                isAddingToCart={isAddingToCart}
                onAddToCart={onAddAndClose}
              />
            </div>
          </div>
        </div>
    );
};

export default ProductDetailModal;
