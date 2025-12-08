import React from 'react';

type Props = {
  selectedCount: number;
  total: number;
  onSelectAll: () => void;
  onAddSelected: () => void;
  onRemoveSelected: () => void;
};

export const WishlistHeader: React.FC<Props> = ({
  selectedCount,
  total,
  onSelectAll,
  onAddSelected,
  onRemoveSelected,
}) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mi Lista de Deseos</h1>
      <p className="text-gray-600 mt-1">
        Productos que te interesan para comprar más tarde
      </p>
    </div>

    {total > 0 && (
      <div className="flex gap-2">
        <button
          onClick={onSelectAll}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {selectedCount === total ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </button>

        {selectedCount > 0 && (
          <>
            <button
              onClick={onAddSelected}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Agregar al carrito ({selectedCount})
            </button>

            <button
              onClick={onRemoveSelected}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Eliminar ({selectedCount})
            </button>
          </>
        )}
      </div>
    )}
  </div>
);
