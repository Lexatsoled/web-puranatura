export const resolveColumnCount = (
  containerWidth: number,
  override: number | undefined
) => {
  if (override) return override;
  if (containerWidth >= 1280) return 4;
  if (containerWidth >= 1024) return 3;
  if (containerWidth >= 640) return 2;
  return 1;
};

export const computeColumnWidth = (
  containerWidth: number,
  gapSize: number,
  columnCount: number
) =>
  containerWidth > 0
    ? (containerWidth - gapSize * (columnCount + 1)) / columnCount
    : 0;

export const buildGridLayout = (
  containerWidth: number,
  gapSize: number,
  itemsPerRow: number | undefined,
  productCount: number
) => {
  const columnCount = resolveColumnCount(containerWidth, itemsPerRow);
  const rowCount = Math.ceil(productCount / columnCount);
  const columnWidth = computeColumnWidth(containerWidth, gapSize, columnCount);
  return { columnCount, rowCount, columnWidth };
};
