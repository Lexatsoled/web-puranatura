// Use CSS animation for spinner and simple transforms; remove framer-motion dependency here
import { StockStatus } from '../../hooks/useProductCardState';

type Props = {
  stockStatus: StockStatus;
  isAddingToCart: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
  stock: number;
};

export const AddToCartButton = ({
  stockStatus,
  isAddingToCart,
  onAddToCart,
  stock,
}: Props) => {
  const buttonState =
    stockStatus === 'out-of-stock'
      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
      : isAddingToCart
        ? 'bg-green-500 text-white cursor-wait'
        : 'bg-green-600 text-white hover:bg-green-700';

  return (
    <button
      type="button"
      onClick={onAddToCart}
      disabled={isAddingToCart || stockStatus === 'out-of-stock'}
      aria-busy={isAddingToCart}
      aria-label={
        stockStatus === 'out-of-stock'
          ? 'Producto agotado'
          : isAddingToCart
            ? 'Agregando al carrito'
            : 'Añadir al carrito'
      }
      className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${buttonState}`}
    >
      {isAddingToCart ? (
        <span className="flex items-center transition-opacity duration-150 opacity-100">
          <SpinnerIcon />
          Agregando...
        </span>
      ) : (
        <>
          <span>{stockStatus === 'out-of-stock' ? 'Agotado' : 'Añadir'}</span>
          {stockStatus === 'low-stock' && (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              Solo {stock} disponibles!
            </span>
          )}
        </>
      )}
    </button>
  );
};

const SpinnerIcon = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
