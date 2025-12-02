import { AnimatePresence, motion } from 'framer-motion';
import { CartItem } from '../../hooks/useShoppingCart';
import { CartItemRow, itemVariants } from './CartItemRow';

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const CartItemsList = ({
  items,
  currencySymbol,
  maxQuantityPerItem,
  handleQuantityChange,
  handleVariantChange,
  onRemoveItem,
}: {
  items: CartItem[];
  currencySymbol: string;
  maxQuantityPerItem: number;
  handleQuantityChange: (itemId: string, quantity: number) => void;
  handleVariantChange: (itemId: string, variantId: string) => void;
  onRemoveItem: (itemId: string) => void;
}) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="divide-y divide-gray-200"
  >
    <AnimatePresence>
      {items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          itemVariants={itemVariants}
          currencySymbol={currencySymbol}
          maxQuantityPerItem={maxQuantityPerItem}
          handleQuantityChange={handleQuantityChange}
          handleVariantChange={handleVariantChange}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </AnimatePresence>
  </motion.div>
);
