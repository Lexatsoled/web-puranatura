import { useCallback, useEffect } from 'react';
import type { Product } from '../types';
import { useProductDetailState } from './product/useProductDetailState';

export function useProductDetail(opts: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  // accept either sync or async addToCart implementations (store may be sync)
  addToCart: (product: Product, quantity: number) => Promise<any> | void;
}) {
  const { product, isOpen, onClose, addToCart } = opts;

  const {
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    isZoomed,
    setIsZoomed,
    mousePosition,
    isAddingToCart,
    setIsAddingToCart,
    handleMouseMove,
  } = useProductDetailState(product, isOpen);

  // keyboard nav + close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setSelectedImage((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
          );
          break;
        case 'ArrowRight':
          setSelectedImage((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
          );
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, product.images.length, onClose]);

  const handleAddToCart = useCallback(async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
      // the component can handle closing / success callback
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  }, [isAddingToCart, addToCart, product, quantity]);

  return {
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
  };
}

export default useProductDetail;
