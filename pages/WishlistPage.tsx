import React from 'react';
import { motion } from 'framer-motion';
import { AccessDenied } from './wishlist/components/AccessDenied';
import { WishlistEmpty } from './wishlist/components/WishlistEmpty';
import { WishlistHeader } from './wishlist/components/WishlistHeader';
import { WishlistItemRow } from './wishlist/components/WishlistItemRow';
import { WishlistSummary } from './wishlist/components/WishlistSummary';
import { useWishlistPage } from './wishlist/useWishlistPage';

const WishlistPage: React.FC = () => {
  const {
    state: { isAccessDenied, hasItems, wishlistItems, selectedItems },
    actions: {
      handleSelectAll,
      handleAddSelectedToCart,
      handleRemoveSelected,
      handleSelectItem,
      handleAddToCart,
      handleRemoveFromWishlist,
      handleClearWishlist,
      formatDate,
    },
    summary,
  } = useWishlistPage();

  if (isAccessDenied) return <AccessDenied />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <WishlistHeader
            selectedCount={selectedItems.length}
            total={wishlistItems.length}
            onSelectAll={handleSelectAll}
            onAddSelected={handleAddSelectedToCart}
            onRemoveSelected={handleRemoveSelected}
          />

          {hasItems ? (
            <div className="space-y-4">
              {wishlistItems.map((item, index) => (
                <WishlistItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  selected={selectedItems.includes(item.id)}
                  onToggleSelect={handleSelectItem}
                  onAddToCart={handleAddToCart}
                  onRemove={handleRemoveFromWishlist}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ) : (
            <WishlistEmpty />
          )}
        </motion.div>

        {/* Resumen de la lista de deseos */}
        {hasItems && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <WishlistSummary
              total={summary.total}
              available={summary.available}
              totalValue={summary.totalValue}
              onClear={handleClearWishlist}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
