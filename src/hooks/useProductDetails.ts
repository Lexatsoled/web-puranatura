import { useEffect, useState } from 'react';
import { useApi } from '../utils/api';
import { Product } from '../types/product';
import { handleProductFetch } from './product/useProductDetails.helpers';

export type ProductFetchStatus = 'loading' | 'ready' | 'error';

export const useProductDetails = (productId?: string) => {
  const api = useApi();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<ProductFetchStatus>('loading');

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setStatus('error');
      return;
    }

    const activeFlag = { current: true };

    void handleProductFetch({
      api,
      productId,
      isActive: () => activeFlag.current,
      onProduct: setProduct,
      onStatus: setStatus,
    });

    return () => {
      activeFlag.current = false;
    };
  }, [api, productId]);

  return {
    product,
    status,
  };
};
