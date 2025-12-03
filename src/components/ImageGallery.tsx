import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ImageGalleryMain } from './imageGallery/ImageGalleryMain';
import { ImageGalleryModal } from './imageGallery/ImageGalleryModal';
import { ImageGalleryThumbs } from './imageGallery/ImageGalleryThumbs';
import { useImageGallery } from './imageGallery/useImageGallery';

interface ImageGalleryProps {
  images: { full: string; thumbnail: string }[];
  productName: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const {
    selectedIndex,
    setSelectedIndex,
    isOpen,
    openModal,
    closeModal,
    handleKeyPress,
  } = useImageGallery(images.length);

  return (
    <div className="space-y-4" onKeyDown={handleKeyPress} tabIndex={0}>
      <ImageGalleryMain
        images={images}
        productName={productName}
        selectedIndex={selectedIndex}
        onOpen={openModal}
      />

      <ImageGalleryThumbs
        images={images}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />

      <AnimatePresence>
        {isOpen && (
          <ImageGalleryModal
            images={images}
            productName={productName}
            selectedIndex={selectedIndex}
            onClose={closeModal}
            onSelect={setSelectedIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
