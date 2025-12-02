import { useState } from 'react';
import { Product } from '../types/product';
import { useCartStore } from '../store/cartStore';
import { useStableMemo, useStableCallback } from './usePerformance';

export type StockStatus = 'out-of-stock' | 'low-stock' | 'in-stock';

export const useProductCardState = (product: Product) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const stockStatus: StockStatus = useStableMemo(() => {
    if (product.stock <= 0) return 'out-of-stock';
    if (product.stock <= 5) return 'low-stock';
    return 'in-stock';
  }, [product.stock]);

  const selectImage = useStableCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  const hoverOn = useStableCallback(() => setIsHovered(true), []);
  const hoverOff = useStableCallback(() => setIsHovered(false), []);

  const handleAddToCart = useStableCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isAddingToCart || stockStatus === 'out-of-stock') return;

      setIsAddingToCart(true);
      try {
        addToCart(product);
      } finally {
        setIsAddingToCart(false);
      }
    },
    [addToCart, isAddingToCart, product, stockStatus]
  );

  return {
    isHovered,
    currentImageIndex,
    isAddingToCart,
    stockStatus,
    selectImage,
    handleAddToCart,
    hoverOn,
    hoverOff,
  };
};
