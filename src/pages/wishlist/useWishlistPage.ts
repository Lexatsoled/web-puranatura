import { useCallback, useMemo, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlist } from '../../contexts/WishlistContext';
import { Product } from '../../types/product';
import { formatDate } from './useWishlistPage.helpers';
import { useBatchActions } from './useBatchActions';

export type WishlistItem = {
  id: string;
  name: string;
  image: string;
  category: string;
  addedDate: Date;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  product: Product;
};

export const useWishlistPage = () => {
  const { user, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));
  const addToCart = useCartStore((state) => state.addToCart);
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const isAccessDenied = !isAuthenticated || !user;
  const hasItems = wishlistItems.length > 0;

  const { handleRemoveSelected, handleClearWishlist, handleAddSelectedToCart } =
    useBatchActions(
      wishlistItems,
      selectedItems,
      removeFromWishlist,
      clearWishlist,
      setSelectedItems,
      addToCart
    );

  const handleSelectItem = useCallback((itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedItems((prev) =>
      prev.length === wishlistItems.length
        ? []
        : wishlistItems.map((item) => item.id)
    );
  }, [wishlistItems]);

  const handleRemoveFromWishlist = useCallback(
    (itemId: string) => {
      removeFromWishlist(itemId);
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    },
    [removeFromWishlist]
  );

  const handleAddToCart = useCallback(
    (item: WishlistItem) => {
      addToCart(item.product);
    },
    [addToCart]
  );

  const summary = useMemo(
    () => ({
      total: wishlistItems.length,
      available: wishlistItems.filter((item) => item.inStock).length,
      totalValue: wishlistItems
        .reduce((total, item) => total + item.price, 0)
        .toFixed(2),
    }),
    [wishlistItems]
  );

  return {
    state: { user, isAccessDenied, hasItems, wishlistItems, selectedItems },
    actions: {
      handleSelectItem,
      handleSelectAll,
      handleRemoveFromWishlist,
      handleAddToCart,
      handleRemoveSelected,
      handleAddSelectedToCart,
      handleClearWishlist,
      formatDate,
    },
    summary,
  };
};
