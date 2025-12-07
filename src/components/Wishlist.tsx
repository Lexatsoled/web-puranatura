import React from 'react';
// Replaced framer-motion with CSS transitions in helpers
import { Product } from '../types';
import { useWishlistSelection } from '../hooks/wishlist/useWishlistSelection';
import {
  WishlistSkeleton,
  WishlistHeader,
  WishlistEmptyState,
  WishlistItem,
  WishlistActions,
} from './Wishlist.helpers';

interface WishlistProps {
  items: Product[];
  onRemoveItem: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
  onShareWishlist?: () => void;
  isLoading?: boolean;
}

const Wishlist: React.FC<WishlistProps> = ({
  items,
  onRemoveItem,
  onMoveToCart,
  onShareWishlist,
  isLoading = false,
}) => {
  const {
    selectedItems,
    selectedProducts,
    toggleItem,
    selectAll,
    clearSelection,
    isAllSelected,
  } = useWishlistSelection(items);

  const handleMoveSelectedToCart = () => {
    selectedProducts.forEach((item) => {
      onMoveToCart(item);
      onRemoveItem(item.id);
    });
    clearSelection();
  };

  if (isLoading) {
    return <WishlistSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <WishlistHeader
        count={items.length}
        isAllSelected={isAllSelected}
        onToggleSelectAll={isAllSelected ? clearSelection : selectAll}
        onShare={onShareWishlist}
      />

      {items.length === 0 ? (
        <WishlistEmptyState />
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                isSelected={selectedItems.has(item.id)}
                onToggle={() => toggleItem(item.id)}
                onMoveToCart={onMoveToCart}
                onRemove={onRemoveItem}
              />
            ))}
          </div>

          {selectedItems.size > 0 && (
            <WishlistActions
              count={selectedItems.size}
              onMoveSelected={handleMoveSelectedToCart}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Wishlist;
