// Use CSS cross-fade for gallery main image; avoid framer-motion
import { OptimizedImage } from '../OptimizedImage';
import { ProductImage } from '../../types/product';
import { DEFAULT_PRODUCT_IMAGE } from '@/src/constants/images';

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
    {images.map((img, idx) => (
      <div
        key={idx}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`Ver imagen ${idx + 1} en tamaño completo`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick();
        }}
        className={`absolute inset-0 cursor-zoom-in transition-opacity duration-300 ${
          idx === selectedImage ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        <OptimizedImage
          src={
            (idx === selectedImage
              ? (img?.full ?? img?.thumbnail)
              : images?.[0]?.thumbnail) ?? DEFAULT_PRODUCT_IMAGE
          }
          alt={`${productName} - Imagen ${idx + 1}`}
          className="w-full h-full object-cover"
          priority={idx === 0}
          aspectRatio={1}
        />
      </div>
    ))}
  </div>
);
