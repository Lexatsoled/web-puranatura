import { motion } from 'framer-motion';
import { OptimizedImage } from '../OptimizedImage';
import { ProductImage } from '../../types/product';

export const GalleryThumbnails = ({
  images,
  selectedImage,
  onSelect,
  productName,
}: {
  images: ProductImage[];
  selectedImage: number;
  onSelect: (index: number) => void;
  productName: string;
}) =>
  images.length > 1 ? (
    <div className="grid grid-cols-4 gap-2">
      {images.map((image, index) => (
        <motion.button
          key={index}
          onClick={() => onSelect(index)}
          className={`relative aspect-square rounded-md overflow-hidden transition-all ${
            selectedImage === index
              ? 'ring-2 ring-green-500 scale-105'
              : 'ring-1 ring-gray-200 hover:ring-gray-300'
          }`}
          whileHover={{ scale: selectedImage === index ? 1.05 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <OptimizedImage
            src={image.thumbnail || image.full}
            alt={`${productName} - Miniatura ${index + 1}`}
            className="w-full h-full object-cover"
            aspectRatio={1}
            blur={false}
          />
          {selectedImage === index && (
            <div className="absolute inset-0 bg-white bg-opacity-20" />
          )}
        </motion.button>
      ))}
    </div>
  ) : null;
