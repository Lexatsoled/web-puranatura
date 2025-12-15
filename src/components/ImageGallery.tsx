import React from 'react';
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
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="space-y-4"
      onKeyDown={(e) => handleKeyPress(e.key)}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      role="region"
      aria-label={`Galería de imágenes de ${productName}`}
    >
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

      {isOpen && (
        <ImageGalleryModal
          images={images}
          productName={productName}
          selectedIndex={selectedIndex}
          onClose={closeModal}
          onSelect={setSelectedIndex}
        />
      )}
    </div>
  );
};

export default ImageGallery;
