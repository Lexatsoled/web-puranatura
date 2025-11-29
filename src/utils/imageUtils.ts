export function generateSrcSet(src: string): string {
  if (!src) return '';

  const baseUrl = src.split('?')[0];
  const extension = baseUrl.split('.').pop();
  const baseName = baseUrl.replace(`.${extension}`, '');

  return [
    `${baseName}_320.${extension} 320w`,
    `${baseName}_640.${extension} 640w`,
    `${baseName}_768.${extension} 768w`,
    `${baseName}_1024.${extension} 1024w`,
    `${src} 1200w`,
  ].join(', ');
}

export default generateSrcSet;
