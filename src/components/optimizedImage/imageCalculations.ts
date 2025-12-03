export const computeDimensions = (
  width?: number | string,
  height?: number | string,
  aspectRatio?: number
) => ({
  finalWidth: width || '100%',
  finalHeight: height || (aspectRatio ? `${100 / aspectRatio}%` : '100%'),
});

export const resolveSrcSet = (src: string, srcSet?: string) => {
  if (srcSet) return srcSet;
  try {
    const { generateSrcSet } = require('../../utils/imageUtils');
    return generateSrcSet(src);
  } catch {
    return '';
  }
};
