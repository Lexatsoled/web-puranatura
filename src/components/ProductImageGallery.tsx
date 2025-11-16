import React from 'react';

interface Image {
  full: string;
  thumbnail?: string;
  alt?: string;
}

interface ProductImageGalleryProps {
  images: Image[];
}

/**
 * Componente ProductImageGallery para mostrar galería de imágenes de producto con accesibilidad y buenas prácticas.
 *
 * @component
 * @param {ProductImageGalleryProps} props - Props para ProductImageGallery
 * @returns {JSX.Element}
 */
const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = React.useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="product-image-gallery" role="region" aria-label="Galería de imágenes de producto">
        <div className="main-image-placeholder">
          <span>No hay imágenes disponibles</span>
        </div>
      </div>
    );
  }

  return (
    <div className="product-image-gallery" role="region" aria-label="Galería de imágenes de producto">
      <div className="main-image">
        <img
          src={images[selectedImage].full}
          alt={images[selectedImage].alt || `Imagen ${selectedImage + 1} del producto`}
          className="w-full h-auto"
        />
      </div>
      {images.length > 1 && (
        <div className="thumbnail-gallery" role="list" aria-label="Miniaturas de producto">
          {images.map((image, index) => (
            <button
              key={`thumb-${index}-${image.thumbnail || image.full}`}
              onClick={() => setSelectedImage(index)}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              aria-label={`Ver imagen ${index + 1}`}
              title={`Ver imagen ${index + 1}`}
              aria-pressed={selectedImage === index ? "true" : "false"}
              role="listitem"
              type="button"
            >
              <img
                src={image.thumbnail}
                alt={image.alt || `Miniatura ${index + 1} del producto`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;