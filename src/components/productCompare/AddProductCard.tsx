import React from 'react';

type Props = { onAdd: () => void };

export const AddProductCard: React.FC<Props> = ({ onAdd }) => (
  <div className="w-72 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
    <button
      onClick={onAdd}
      className="p-6 text-center text-gray-500 hover:text-gray-700 transition-colors"
    >
      <svg
        className="w-12 h-12 mx-auto mb-2"
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
      <span className="block font-medium">Agregar Producto para Comparar</span>
    </button>
  </div>
);
