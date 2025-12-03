import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from '../OptimizedImage';
import { ProductImage } from '../../types/product';

export const GalleryMainImage = ({
  images,
  productName,
  selectedImage,
  onClick,
}: {
  images: ProductImage[];
  productName: string;
  selectedImage: number;
  onClick: () => void;
}) => (
  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 cursor-zoom-in"
        onClick={onClick}
      >
        <OptimizedImage
          src={images[selectedImage]?.full || images[selectedImage]?.thumbnail}
          alt={`${productName} - Imagen ${selectedImage + 1}`}
          className="w-full h-full object-cover"
          priority={selectedImage === 0}
          aspectRatio={1}
        />
      </motion.div>
    </AnimatePresence>
  </div>
);
