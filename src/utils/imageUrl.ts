export const generateImageUrl = (
  url: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg';
  }
) => {
  const params = new URLSearchParams();

  if (options.width) {
    params.append('w', options.width.toString());
  }

  if (options.quality) {
    params.append('q', options.quality.toString());
  }

  if (options.format) {
    params.append('f', options.format);
  }

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};
