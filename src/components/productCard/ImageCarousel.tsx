import { AnimatePresence, motion } from 'framer-motion';
import { Product } from '../../types/product';
import { OptimizedImage } from '../OptimizedImage';

type Props = {
  images: Product['images'];
  productName: string;
  currentImageIndex: number;
  onSelectImage: (index: number) => void;
  isHovered: boolean;
  priority: boolean;
};

export const ImageCarousel = ({
  images,
  productName,
  currentImageIndex,
  onSelectImage,
  isHovered,
  priority,
}: Props) => (
  <>
    <AnimatePresence mode="wait">
      <motion.div
        key={currentImageIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
      >
        <OptimizedImage
          src={images[currentImageIndex]?.full || images[0].full}
          alt={productName}
          className="w-full h-full object-cover"
          aspectRatio={1}
          priority={priority}
          blur
        />
      </motion.div>
    </AnimatePresence>

    {images.length > 1 && isHovered && (
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentImageIndex
                ? 'bg-green-500'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectImage(index);
            }}
          />
        ))}
      </div>
    )}
  </>
);
