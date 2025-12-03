import React from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '../OptimizedImage';

type Props = {
  images: { full: string; thumbnail: string }[];
  productName: string;
  selectedIndex: number;
  onOpen: () => void;
};

export const ImageGalleryMain: React.FC<Props> = ({
  images,
  productName,
  selectedIndex,
  onOpen,
}) => (
  <motion.div
    className="relative aspect-square rounded-lg overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    onClick={onOpen}
  >
    <OptimizedImage
      src={images[selectedIndex]?.full}
      alt={productName}
      className="w-full h-full object-cover"
      aspectRatio={1}
    />
    <button className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
      Ver en grande
    </button>
  </motion.div>
);
