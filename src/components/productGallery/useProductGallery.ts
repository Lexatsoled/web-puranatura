import { useState, useCallback, useEffect } from 'react';
import { ProductImage } from '../../types/product';

export const useProductGallery = (images: ProductImage[]) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = useCallback(
    () => setSelectedImage((prev) => (prev + 1) % images.length),
    [images.length]
  );

  const prevImage = useCallback(
    () =>
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!isFullscreen) {
      document.body.style.overflow = 'unset';
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen, nextImage, prevImage]);

  return {
    selectedImage,
    isFullscreen,
    setIsFullscreen,
    setSelectedImage,
    nextImage,
    prevImage,
  };
};
