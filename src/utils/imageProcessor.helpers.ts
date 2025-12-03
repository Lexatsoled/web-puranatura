import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export interface ProcessImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg';
}

export const ensureDir = (outputPath: string) =>
  fs.mkdir(path.dirname(outputPath), { recursive: true });

export const buildOutputPaths = (input: string, outputDir: string) => {
  const baseName = path.parse(input).name;
  return {
    fullWebp: path.join(outputDir, `${baseName}.webp`),
    thumbWebp: path.join(outputDir, `${baseName}-thumb.webp`),
    fullAvif: path.join(outputDir, `${baseName}.avif`),
  };
};

export const resizeAndFormat = (
  img: sharp.Sharp,
  { width, height, format = 'webp', quality = 80 }: ProcessImageOptions
) => {
  let pipeline = img;
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'cover',
      position: 'center',
    });
  }
  switch (format) {
    case 'webp':
      return pipeline.webp({ quality });
    case 'avif':
      return pipeline.avif({ quality });
    case 'jpeg':
      return pipeline.jpeg({ quality });
    default:
      return pipeline;
  }
};
