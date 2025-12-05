import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useWishlistSelection } from '../hooks/wishlist/useWishlistSelection';
import {
  WishlistSkeleton,
  WishlistHeader,
  WishlistEmptyState,
  containerVariants,
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
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <AnimatePresence>
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
            </AnimatePresence>
          </motion.div>

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
