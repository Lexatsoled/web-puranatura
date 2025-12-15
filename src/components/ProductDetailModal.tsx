import React, { useEffect, useState, useRef } from 'react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import useProductDetail from '../hooks/useProductDetail';
import { ProductDetailGallery } from './productDetail/ProductDetailGallery';
import { ProductDetailInfo } from './productDetail/ProductDetailInfo';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, { isActive: isOpen, onEscape: onClose });

  const {
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    isZoomed,
    setIsZoomed,
    mousePosition,
    handleMouseMove,
    isAddingToCart,
    handleAddToCart,
  } = useProductDetail({ product, isOpen, onClose, addToCart });

  const onPrev = () => {
    setSelectedImage(
      selectedImage > 0 ? selectedImage - 1 : product.images.length - 1
    );
  };

  const onNext = () => {
    setSelectedImage(
      selectedImage < product.images.length - 1 ? selectedImage + 1 : 0
    );
  };

  // Keep this component simple: animate only on mount with CSS classes.
  // We remove framer-motion so the runtime won't be pulled into shared chunks.

  // NOTE: hooks must be executed in the same order every render. Keep
  // state/effect hooks at the top-level even if rendering early-return
  // paths are used later.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen) return null;

  const onAddAndClose = async () => {
    await handleAddToCart();
    onAddToCartSuccess?.();
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-200 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}
      >
        <div
          className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-200 pointer-events-auto ${
            mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <button
              onClick={onPrev}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Anterior imagen"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={onNext}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={24} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              aria-label="Cerrar galería"
            >
              <X size={24} />
            </button>
          </div>
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
    </>
  );
};

export default ProductDetailModal;
