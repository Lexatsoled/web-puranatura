import { useCallback, useEffect } from 'react';
import type { Product } from '../../types';

export interface KeyboardNavigationArgs {
  isOpen: boolean;
  imageCount: number;
  onClose: () => void;
  setSelectedImage: React.Dispatch<React.SetStateAction<number>>;
}

const getPrevIndex = (current: number, count: number) =>
  current === 0 ? count - 1 : current - 1;

const getNextIndex = (current: number, count: number) =>
  current === count - 1 ? 0 : current + 1;

export const useProductDetailKeyboard = ({
  isOpen,
  imageCount,
  onClose,
  setSelectedImage,
}: KeyboardNavigationArgs) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const handlers: Record<string, () => void> = {
        Escape: onClose,
        ArrowLeft: () =>
          setSelectedImage((prev) => getPrevIndex(prev, imageCount)),
        ArrowRight: () =>
          setSelectedImage((prev) => getNextIndex(prev, imageCount)),
      };

      const handler = handlers[e.key];
      if (handler) {
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, imageCount, onClose, setSelectedImage]);
};

export interface AddToCartHandlerArgs {
  addToCart: (product: Product, quantity: number) => Promise<any> | void;
  product: Product;
  quantity: number;
  isAddingToCart: boolean;
  setIsAddingToCart: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useProductDetailAddToCart = ({
  addToCart,
  product,
  quantity,
  isAddingToCart,
  setIsAddingToCart,
}: AddToCartHandlerArgs) => {
  return useCallback(async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  }, [addToCart, isAddingToCart, product, quantity, setIsAddingToCart]);
};
