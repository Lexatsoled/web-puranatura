import {
  useProductDetailAddToCart,
  useProductDetailKeyboard,
} from './product/useProductDetail.helpers';
import type { Product } from '../types';
import { useProductDetailState } from './product/useProductDetailState';

export function useProductDetail(opts: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  // accept either sync or async addToCart implementations (store may be sync)
  addToCart: (product: Product, quantity: number) => Promise<any> | void;
}) {
  const { product, isOpen, onClose, addToCart } = opts;

  const {
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    isZoomed,
    setIsZoomed,
    mousePosition,
    isAddingToCart,
    setIsAddingToCart,
    handleMouseMove,
  } = useProductDetailState(product, isOpen);

  useProductDetailKeyboard({
    isOpen,
    imageCount: product.images.length,
    onClose,
    setSelectedImage,
  });

  const handleAddToCart = useProductDetailAddToCart({
    addToCart,
    product,
    quantity,
    isAddingToCart,
    setIsAddingToCart,
  });

  return {
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    isZoomed,
    setIsZoomed,
    mousePosition,
    isAddingToCart,
    handleMouseMove,
    handleAddToCart,
  };
}

export default useProductDetail;
