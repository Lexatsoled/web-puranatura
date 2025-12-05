export const resolveSrcSet = (src: string, srcSet?: string) => {
  if (srcSet) return srcSet;
  try {
    const { generateSrcSet } = require('../../utils/imageUtils');
    return generateSrcSet(src);
  } catch {
    return '';
  }
};
