import React, { useRef } from 'react';
import { Grid } from 'react-window';
import { Product } from '../types/product';
import { ProductGridCell } from './virtualGrid/ProductGridCell';
import {
  EmptyState,
  LoadingPlaceholder,
  PerformanceStats,
} from './virtualGrid/Placeholders';
import { useGridDimensions, useGridLayout } from './virtualGrid/useGridLayout';

interface VirtualProductGridProps {
  products: Product[];
  itemsPerRow?: number;
  cardHeight?: number;
  gapSize?: number;
}

export const VirtualProductGrid: React.FC<VirtualProductGridProps> = ({
  products,
  itemsPerRow,
  cardHeight = 450,
  gapSize = 32,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { containerWidth, containerHeight } = useGridDimensions(
    containerRef,
    cardHeight
  );

  const { columnCount, columnWidth, rowCount } = useGridLayout(
    containerWidth,
    gapSize,
    itemsPerRow,
    products.length
  );

  if (!containerWidth) {
    return (
      <div ref={containerRef} className="w-full">
        <LoadingPlaceholder />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <Grid
          cellComponent={(cellProps) => (
            <ProductGridCell
              {...cellProps}
              cardHeight={cardHeight}
              columnCount={columnCount}
              columnWidth={columnWidth}
              gapSize={gapSize}
              products={products}
            />
          )}
          cellProps={{} as never}
          columnCount={columnCount}
          columnWidth={columnWidth + gapSize}
          rowCount={rowCount}
          rowHeight={cardHeight + gapSize}
          style={{ height: containerHeight, width: containerWidth }}
          className="scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-200"
          overscanCount={2}
        />
      )}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceStats
          products={products.length}
          columnCount={columnCount}
          containerHeight={containerHeight}
          cardHeight={cardHeight}
          gapSize={gapSize}
          rowCount={rowCount}
        />
      )}
    </div>
  );
};

export default VirtualProductGrid;
