import React from 'react';

type Props = {
  total: number;
  available: number;
  totalValue: string;
  onClear: () => void;
};

export const WishlistSummary: React.FC<Props> = ({
  total,
  available,
  totalValue,
  onClear,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">
      Resumen de la Lista
    </h2>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Total de productos:</span>
        <span className="font-medium">
          {total} productos {available} disponibles
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">Valor total:</span>
        <span className="font-medium text-green-700">DOP ${totalValue}</span>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-gray-200">
      <button
        onClick={onClear}
        className="text-red-600 hover:text-red-700 text-sm font-medium"
      >
        Vaciar lista de deseos
      </button>
    </div>
  </div>
);
