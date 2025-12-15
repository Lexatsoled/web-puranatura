// Use CSS-based cross-fade for carousel images instead of framer-motion
import { Product } from '../../types/product';
import { OptimizedImage } from '../OptimizedImage';
import { DEFAULT_PRODUCT_IMAGE } from '../../constants/images';

type Props = {
  images: Product['images'];
  productName: string;
  currentImageIndex: number;
  onSelectImage: (index: number) => void;
  isHovered: boolean;
  priority: boolean;
  onImageClick?: () => void;
};

export const ImageCarousel = ({
  images,
  productName,
  currentImageIndex,
  onSelectImage,
  isHovered,
  priority,
  onImageClick,
}: Props) => (
  <>
    <div className="absolute inset-0">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-300 ${
            idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <button
            type="button"
            onClick={onImageClick}
            className="w-full h-full p-0 border-0 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer block text-left"
            tabIndex={idx === currentImageIndex ? 0 : -1}
            aria-label={`Ver detalles de ${productName}`}
            disabled={!onImageClick}
          >
            <OptimizedImage
              src={
                (idx === currentImageIndex
                  ? (img?.full ?? img?.thumbnail)
                  : (images?.[0]?.full ?? images?.[0]?.thumbnail)) ??
                DEFAULT_PRODUCT_IMAGE
              }
              alt={productName}
              className="w-full h-full object-cover"
              aspectRatio={1}
              priority={priority && idx === currentImageIndex}
              blur
            />
          </button>
        </div>
      ))}
    </div>

    {images.length > 1 && isHovered && (
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ver imagen ${index + 1} de ${images.length}`}
            aria-pressed={index === currentImageIndex}
            className={`w-3 h-3 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
              index === currentImageIndex
                ? 'bg-green-500'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectImage(index);
              // prevent default to allow focus to stay or move appropriately?
            }}
          />
        ))}
      </div>
    )}
  </>
);
