export const CartSummary = ({
  summary,
  onCheckout,
  isLoading,
  currencySymbol,
}: {
  summary: {
    currencySymbol: string;
    subtotal: number;
    discount: number;
    shippingCost: number;
    tax: number;
    taxRate: number;
    total: number;
    totalItems: number;
  };
  onCheckout?: () => void;
  isLoading: boolean;
  currencySymbol: string;
}) => (
  <div className="mt-8 border-t border-gray-200 pt-8">
    <div className="space-y-4">
      <SummaryRow
        label={`Subtotal (${summary.totalItems} productos)`}
        value={summary.subtotal}
        currencySymbol={currencySymbol}
      />
      {summary.discount > 0 && (
        <SummaryRow
          label="Descuento"
          value={-summary.discount}
          prefix="-"
          currencySymbol={currencySymbol}
          className="text-green-600"
        />
      )}
      {summary.shippingCost > 0 && (
        <SummaryRow
          label="Envío"
          value={summary.shippingCost}
          currencySymbol={currencySymbol}
        />
      )}
      {summary.tax > 0 && (
        <SummaryRow
          label={`IVA (${(summary.taxRate * 100).toFixed(0)}%)`}
          value={summary.tax}
          currencySymbol={currencySymbol}
        />
      )}
      <div className="flex justify-between text-lg font-bold text-gray-900">
        <span>Total</span>
        <span>
          {currencySymbol}
          {summary.total.toFixed(2)}
        </span>
      </div>
    </div>
    <CheckoutButton onCheckout={onCheckout} isLoading={isLoading} />
  </div>
);

const SummaryRow = ({
  label,
  value,
  prefix = '',
  currencySymbol,
  className = 'text-gray-600',
}: {
  label: string;
  value: number;
  prefix?: string;
  currencySymbol: string;
  className?: string;
}) => (
  <div className={`flex justify-between ${className}`}>
    <span>{label}</span>
    <span>
      {prefix}
      {currencySymbol}
      {Math.abs(value).toFixed(2)}
    </span>
  </div>
);

const CheckoutButton = ({
  isLoading,
  onCheckout,
}: {
  isLoading: boolean;
  onCheckout?: () => void;
}) => (
  <button
    className={`w-full mt-8 px-6 py-3 rounded-lg font-semibold text-white ${
      isLoading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-green-600 hover:bg-green-700'
    } transition-colors`}
    onClick={onCheckout}
    disabled={isLoading}
  >
    {isLoading ? (
      <span className="flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
        Procesando...
      </span>
    ) : (
      'Finalizar Compra'
    )}
  </button>
);
