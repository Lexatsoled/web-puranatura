type Props = {
  searchQuery: string;
  onContactSupport?: () => void;
};

export const FaqEmptyState = ({ searchQuery, onContactSupport }: Props) => (
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
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p className="text-gray-600 mb-4">
      No se encontraron resultados para "{searchQuery}"
    </p>
    {onContactSupport && (
      <button
        onClick={onContactSupport}
        className="text-green-600 hover:text-green-700 font-medium"
      >
        Contactar con soporte
      </button>
    )}
  </div>
);
