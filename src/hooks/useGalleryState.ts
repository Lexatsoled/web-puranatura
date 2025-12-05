import { useState } from 'react';

export const useGalleryState = (imagesLength: number) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % imagesLength);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + imagesLength) % imagesLength);
  };

  return {
    selectedImage,
    setSelectedImage,
    isZoomed,
    setIsZoomed,
    handleImageClick,
    handleNext,
    handlePrev,
  };
};
