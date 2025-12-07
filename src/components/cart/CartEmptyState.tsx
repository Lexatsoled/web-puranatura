// Simple static cart empty state — no framer-motion required

export const CartEmptyState = () => (
  <div className="text-center py-12">
    <svg
      className="mx-auto h-12 w-12 text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
    <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
    <button className="text-green-600 hover:text-green-700 font-medium">
      Continuar comprando
    </button>
  </div>
);
