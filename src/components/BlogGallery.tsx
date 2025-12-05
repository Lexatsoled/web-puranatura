import React from 'react';
import { useGalleryState } from '../hooks/useGalleryState';
import { GalleryMainImage, ThumbnailGrid } from './BlogGallery.helpers';

interface BlogGalleryProps {
  images: string[];
  alt: string;
}

export const BlogGallery: React.FC<BlogGalleryProps> = ({ images, alt }) => {
  const {
    selectedImage,
    setSelectedImage,
    isZoomed,
    setIsZoomed,
    handleImageClick,
    handleNext,
    handlePrev,
  } = useGalleryState(images.length);

  if (images.length === 0) return null;

  const showControls = isZoomed && images.length > 1;
  const showThumbnails = images.length > 1 && !isZoomed;

  return (
    <>
      <div className="space-y-4">
        <GalleryMainImage
          image={images[selectedImage]}
          alt={`${alt} - Imagen ${selectedImage + 1}`}
          isZoomed={isZoomed}
          onImageClick={handleImageClick}
          showControls={showControls}
          onPrev={handlePrev}
          onNext={handleNext}
          onClose={() => setIsZoomed(false)}
        />

        {showThumbnails && (
          <ThumbnailGrid
            images={images}
            selectedImage={selectedImage}
            onSelect={setSelectedImage}
            alt={alt}
          />
        )}
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsZoomed(false)}
        />
      )}
    </>
  );
};

export default BlogGallery;
