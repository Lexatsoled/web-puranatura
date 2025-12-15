export function generateSrcSet(src: string): string {
  if (!src) return '';

  if (!src) return '';

  // TEMPORARY FIX: Disable responsive srcset generation.
  // Many images in /optimized/ do not have all size variants (_320, _640, etc).
  // Requesting a missing variant returns index.html (200 OK) in Vite, breaking the image.
  // By returning empty string, we force the browser to use the reliable 'src' attribute.
  return '';

  /*
  const buildPath = (suffix: string) => encodeURI(`${baseName}${suffix}.${extension}`);

  return [
    `${buildPath('_320')} 320w`,
    `${buildPath('_640')} 640w`,
    `${buildPath('_768')} 768w`,
    `${buildPath('_1024')} 1024w`,
    `${encodeURI(src)} 1200w`,
  ].join(', ');
  */
}

export default generateSrcSet;
