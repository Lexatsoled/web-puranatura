import sharp from 'sharp';

export type OptimizeFormat = 'jpeg' | 'png' | 'webp' | 'avif';

export interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: OptimizeFormat;
}

export interface VariantOptions {
  suffix: string;
  width: number;
  quality: number;
}

export class ImageOptimizer {
  async optimize(inputPath: string, outputPath: string, options: OptimizeOptions = {}): Promise<void> {
    const { width, height, quality = 80, format = 'webp' } = options;

    let pipeline = sharp(inputPath);

    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality });
        break;
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        break;
      case 'png':
        pipeline = pipeline.png({ compressionLevel: 9 });
        break;
      default:
        pipeline = pipeline.webp({ quality });
    }

    await pipeline.toFile(outputPath);
  }

  async generateVariants(inputPath: string, basePath: string): Promise<Array<{ size: string; path: string }>> {
    const variants: VariantOptions[] = [
      { suffix: '-sm', width: 320, quality: 75 },
      { suffix: '-md', width: 640, quality: 80 },
      { suffix: '-lg', width: 960, quality: 80 },
      { suffix: '-xl', width: 1280, quality: 85 },
    ];

    const results: Array<{ size: string; path: string }> = [];

    for (const variant of variants) {
      const outputPath = basePath.replace(/(\.\w+)$/, `${variant.suffix}.webp`);
      await this.optimize(inputPath, outputPath, {
        width: variant.width,
        quality: variant.quality,
        format: 'webp',
      });
      results.push({ size: variant.suffix, path: outputPath });
    }

    return results;
  }
}
