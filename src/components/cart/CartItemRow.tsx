import { OptimizedImage } from '../OptimizedImage';
import { useCartItemState } from '../../hooks/useCartItemState';
import { CartItem } from '../../hooks/useShoppingCart';

// Using CSS for row transitions instead of framer-motion

export const CartItemRow = ({
  item,
  currencySymbol,
  maxQuantityPerItem,
  handleQuantityChange,
  handleVariantChange,
  onRemoveItem,
}: {
  item: CartItem;
  currencySymbol: string;
  maxQuantityPerItem: number;
  handleQuantityChange: (itemId: string, quantity: number) => void;
  handleVariantChange: (itemId: string, variantId: string) => void;
  onRemoveItem: (itemId: string) => void;
}) => {
  const { increment, decrement, isMaxReached, selectVariant } =
    useCartItemState({
      item,
      maxQuantityPerItem,
      handleQuantityChange,
      handleVariantChange,
    });

  return (
    <div className="py-6 flex items-center">
      <ProductImageCell item={item} />
      <div className="ml-6 flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
            {item.variants && item.variants.length > 0 && (
              <VariantSelect
                item={item}
                currencySymbol={currencySymbol}
                onChangeVariant={selectVariant}
              />
            )}
          </div>
          <PriceBlock item={item} currencySymbol={currencySymbol} />
        </div>
        <CartQuantityControl
          item={item}
          isMaxReached={isMaxReached}
          onIncrement={increment}
          onDecrement={decrement}
          onRemove={() => onRemoveItem(item.id)}
        />
      </div>
    </div>
  );
};

const ProductImageCell = ({ item }: { item: CartItem }) => (
  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
    {item.image ? (
      <OptimizedImage
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover"
        aspectRatio={1}
      />
    ) : (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )}
  </div>
);

const VariantSelect = ({
  item,
  currencySymbol,
  onChangeVariant,
}: {
  item: CartItem;
  currencySymbol: string;
  onChangeVariant: (variantId: string) => void;
}) => (
  <select
    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
    value={item.selectedVariantId}
    onChange={(e) => onChangeVariant(e.target.value)}
  >
    {item.variants?.map((variant) => (
      <option key={variant.id} value={variant.id}>
        {variant.name}
        {variant.price && ` (+${currencySymbol}${variant.price.toFixed(2)})`}
      </option>
    ))}
  </select>
);

const PriceBlock = ({
  item,
  currencySymbol,
}: {
  item: CartItem;
  currencySymbol: string;
}) => (
  <div className="text-right">
    <p className="text-lg font-medium text-gray-900">
      {currencySymbol}
      {(item.price * item.quantity).toFixed(2)}
    </p>
    {item.discount && (
      <p className="text-sm text-green-600">
        Ahorro: {currencySymbol}
        {(item.discount * item.quantity).toFixed(2)}
      </p>
    )}
  </div>
);

const CartQuantityControl = ({
  item,
  isMaxReached,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: CartItem;
  isMaxReached: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) => (
  <div className="mt-4 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <QuantityButton disabled={item.quantity <= 1} onClick={onDecrement}>
        <span className="sr-only">Reducir cantidad</span>
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      </QuantityButton>
      <span className="text-gray-600 select-none w-8 text-center">
        {item.quantity}
      </span>
      <QuantityButton disabled={isMaxReached} onClick={onIncrement}>
        <span className="sr-only">Incrementar cantidad</span>
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </QuantityButton>
    </div>
    <button className="text-red-600 hover:text-red-700" onClick={onRemove}>
      Eliminar
    </button>
  </div>
);

const QuantityButton = ({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    className="p-1 rounded-full hover:bg-gray-100"
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
