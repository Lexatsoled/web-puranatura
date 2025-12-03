import { Product } from '../../../src/types/product';
import { useLocation } from 'react-router-dom';
import { useSeo } from '../../../src/hooks/useSeo';

export const useProductSeo = (product?: Product | null) => {
  const location = useLocation();
  const currentUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${location.pathname}`
      : '';

  const seoConfig = useSeo({
    title: product?.name,
    description: product?.description,
    type: 'product',
    image: product?.images[0]?.full,
  });

  return { currentUrl, seoConfig };
};
