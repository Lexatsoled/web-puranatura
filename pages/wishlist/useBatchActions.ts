import { useCallback } from 'react';
import { WishlistItem } from './useWishlistPage';

export const useBatchActions = (
  wishlistItems: WishlistItem[],
  selectedItems: string[],
  removeFromWishlist: (id: string) => void,
  clearWishlist: () => void,
  setSelectedItems: (items: string[]) => void,
  addToCart: (product: any) => void
) => {
  const handleRemoveSelected = useCallback(() => {
    const confirmMsg = `Estas seguro de que quieres eliminar ${selectedItems.length} productos de tu lista de deseos?`;
    if (selectedItems.length > 0 && window.confirm(confirmMsg)) {
      selectedItems.forEach((itemId) => removeFromWishlist(itemId));
      setSelectedItems([]);
    }
  }, [removeFromWishlist, selectedItems, setSelectedItems]);

  const handleClearWishlist = useCallback(() => {
    if (
      window.confirm(
        'Estas seguro de que quieres vaciar toda tu lista de deseos?'
      )
    ) {
      clearWishlist();
      setSelectedItems([]);
    }
  }, [clearWishlist, setSelectedItems]);

  const handleAddSelectedToCart = useCallback(() => {
    const selectedInStockItems = wishlistItems.filter(
      (item) => selectedItems.includes(item.id) && item.inStock
    );

    selectedInStockItems.forEach((item) => addToCart(item.product));

    if (selectedInStockItems.length > 0) {
      alert(
        `Se agregaron ${selectedInStockItems.length} productos al carrito.`
      );
    }
  }, [addToCart, selectedItems, wishlistItems, setSelectedItems]);

  return {
    handleRemoveSelected,
    handleClearWishlist,
    handleAddSelectedToCart,
  };
};
