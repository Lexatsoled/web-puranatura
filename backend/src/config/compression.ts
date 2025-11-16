import { config } from './index.js';

const DEFAULT_COMPRESSIBLE_TYPES =
  /^text\/|application\/(json|javascript|xml)|image\/svg\+xml/i;

export type CompressionConfig = {
  enabled: boolean;
  threshold: number;
  brotliQuality: number;
  gzipLevel: number;
  encodings: Array<'br' | 'gzip' | 'deflate'>;
  customTypes: RegExp;
};

export const compressionConfig: CompressionConfig = {
  enabled: config.COMPRESSION_ENABLED,
  threshold: config.COMPRESSION_THRESHOLD,
  brotliQuality: config.COMPRESSION_LEVEL,
  gzipLevel: 6,
  encodings: ['br', 'gzip', 'deflate'],
  customTypes: DEFAULT_COMPRESSIBLE_TYPES,
};
