import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export interface ProcessImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg';
}

const DEFAULT_OPTIONS: ProcessImageOptions = {
  // width/height undefined means 'no resize' — keep them optional
  width: undefined,
  height: undefined,
  quality: 80,
  format: 'webp',
};

type FormatKey = NonNullable<ProcessImageOptions['format']>;
const formatProcessors: Record<
  FormatKey,
  (img: sharp.Sharp, quality: number) => sharp.Sharp
> = {
  webp: (img, quality) => img.webp({ quality }),
  avif: (img, quality) => img.avif({ quality }),
  jpeg: (img, quality) => img.jpeg({ quality }),
};

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

const resizePipeline = (img: sharp.Sharp, width?: number, height?: number) =>
  width || height
    ? img.resize(width, height, {
        fit: 'cover',
        position: 'center',
      })
    : img;

export const resizeAndFormat = (
  img: sharp.Sharp,
  options: ProcessImageOptions = {}
) => {
  const { width, height, format, quality } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  const resized = resizePipeline(img, width, height);
  const processor = format ? formatProcessors[format as FormatKey] : undefined;
  return processor ? processor(resized, quality as number) : resized;
};
