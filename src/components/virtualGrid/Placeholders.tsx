export const LoadingPlaceholder = () => (
  <div className="text-center py-20">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
    <p className="mt-4 text-gray-600">Preparando vista...</p>
  </div>
);

export const EmptyState = () => (
  <div className="text-center py-20">
    <h2 className="text-2xl font-semibold text-gray-600">
      No se encontraron productos
    </h2>
    <p className="text-gray-500 mt-2">Intenta ajustar tu búsqueda o filtros.</p>
  </div>
);

export const PerformanceStats = ({
  products,
  columnCount,
  containerHeight,
  cardHeight,
  gapSize,
  rowCount,
}: {
  products: number;
  columnCount: number;
  containerHeight: number;
  cardHeight: number;
  gapSize: number;
  rowCount: number;
}) => (
  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
    <p className="font-semibold text-blue-800">Virtual Scrolling Stats:</p>
    <p className="text-blue-700">
      Total productos: {products} | Columnas: {columnCount} | Filas: {rowCount}{' '}
      | Renderizados simultáneamente:{' '}
      {Math.min(
        Math.ceil(containerHeight / (cardHeight + gapSize)) * columnCount,
        products
      )}
    </p>
    <p className="text-blue-600 text-xs mt-1">
      Mejora de rendimiento:{' '}
      {Math.round(
        (1 -
          (Math.ceil(containerHeight / (cardHeight + gapSize)) * columnCount) /
            products) *
          100
      )}
      % menos componentes en DOM
    </p>
  </div>
);
