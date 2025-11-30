import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';

export function useProductDetail(opts: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  // accept either sync or async addToCart implementations (store may be sync)
  addToCart: (product: Product, quantity: number) => Promise<any> | void;
}) {
  const { product, isOpen, onClose, addToCart } = opts;

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

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';

    // cleanup should be a function (avoid returning the assignment result)
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
