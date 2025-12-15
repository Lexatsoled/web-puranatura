import { generateSrcSet } from '../../utils/imageUtils';

export const resolveSrcSet = (src: string, srcSet?: string) => {
  if (srcSet) return srcSet;
  try {
    return generateSrcSet(src);
  } catch {
    return '';
  }
};
