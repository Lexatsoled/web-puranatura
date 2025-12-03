import { Product } from '../../../src/types/product';

export const ProductHero = ({ product }: { product: Product }) => (
  <div className="relative aspect-square rounded-lg overflow-hidden">
    <img
      src={product.images[0]?.full}
      alt={product.name}
      className="object-cover w-full h-full"
      loading="lazy"
      decoding="async"
    />
  </div>
);
