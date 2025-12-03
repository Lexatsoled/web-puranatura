import React from 'react';
import { Product } from '../../types/product';
import ProductCard from '../ProductCard';
import styles from '../VirtualProductGrid.module.css';

type GridCellProps = {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  ariaAttributes: Record<string, string>;
  columnCount: number;
  columnWidth: number;
  cardHeight: number;
  gapSize: number;
  products: Product[];
};

export const ProductGridCell: React.FC<GridCellProps> = ({
  columnIndex,
  rowIndex,
  style,
  ariaAttributes,
  columnCount,
  columnWidth,
  cardHeight,
  gapSize,
  products,
}) => {
  const index = rowIndex * columnCount + columnIndex;
  const cellStyle = {
    ...style,
    left: `${Number(style.left) + gapSize}px`,
    top: `${Number(style.top) + gapSize}px`,
    width: `${columnWidth}px`,
    height: `${cardHeight}px`,
  };

  if (index >= products.length) return <div style={cellStyle} />;

  return (
    <div style={cellStyle} className={styles.gridCell} {...ariaAttributes}>
      <ProductCard product={products[index]} />
    </div>
  );
};
