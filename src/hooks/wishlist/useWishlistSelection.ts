import { useCallback, useEffect, useMemo, useState } from 'react';
import { Product } from '../../types';

export const useWishlistSelection = (products: Product[]) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedItems(
      (prev) =>
        new Set(
          [...prev].filter((id) =>
            products.some((product) => product.id === id)
          )
        )
    );
  }, [products]);

  const toggleItem = useCallback((productId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedItems(new Set()), []);

  const selectAll = useCallback(() => {
    setSelectedItems(new Set(products.map(({ id }) => id)));
  }, [products]);

  const isAllSelected = useMemo(
    () => products.length > 0 && selectedItems.size === products.length,
    [products.length, selectedItems]
  );

  const selectedProducts = useMemo(
    () => products.filter((item) => selectedItems.has(item.id)),
    [products, selectedItems]
  );

  return {
    selectedItems,
    toggleItem,
    clearSelection,
    selectAll,
    isAllSelected,
    selectedProducts,
  };
};
