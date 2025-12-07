export const computeDimensions = (
  width?: number | string,
  height?: number | string,
  aspectRatio?: number
) => ({
  finalWidth: width || '100%',
  finalHeight: height || (aspectRatio ? `${100 / aspectRatio}%` : '100%'),
});
