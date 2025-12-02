import { useEffect, useMemo, useState } from 'react';
import { useApi } from '../utils/api';
import { ApiProduct, mapApiProduct } from '../utils/productMapper';
import { Product } from '../types/product';
import { sanitizeProductContent } from '../utils/contentSanitizers';
import { products as legacyProducts } from '../../data/products';

export type ProductFetchStatus = 'loading' | 'ready' | 'error';

export const useProductDetails = (productId?: string) => {
  const api = useApi();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<ProductFetchStatus>('loading');

  const fallbackProducts = useMemo(
    () => legacyProducts.map((legacy) => sanitizeProductContent(legacy)),
    []
  );

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setStatus('error');
      return;
    }

    let active = true;

    const fetchProduct = async () => {
      setStatus('loading');
      try {
        const apiProduct = await api.get<ApiProduct>(`/products/${productId}`);
        if (!active) return;
        setProduct(sanitizeProductContent(mapApiProduct(apiProduct)));
        setStatus('ready');
      } catch {
        if (!active) return;
        const fallback = fallbackProducts.find((item) => item.id === productId);
        if (fallback) {
          setProduct(fallback);
          setStatus('ready');
        } else {
          setProduct(null);
          setStatus('error');
        }
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [api, fallbackProducts, productId]);

  return {
    product,
    status,
  };
};
