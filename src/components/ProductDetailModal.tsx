import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  if (!isOpen) return null;

  const onAddAndClose = async () => {
    await handleAddToCart();
    onAddToCartSuccess?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
