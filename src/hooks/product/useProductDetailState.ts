import { useCallback, useEffect, useState } from 'react';
import type { Product } from '../../types';

export const useProductDetailState = (_product: Product, isOpen: boolean) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedImage(0);
      setQuantity(1);
      setIsZoomed(false);
      setIsAddingToCart(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleMouseMove = useCallback(
    (e: { currentTarget: Element; clientX: number; clientY: number }) => {
      if (!isZoomed) return;

      const bounds = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - bounds.left) / bounds.width) * 100;
      const y = ((e.clientY - bounds.top) / bounds.height) * 100;
      setMousePosition({ x, y });
    },
    [isZoomed]
  );

  return {
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
  };
};
