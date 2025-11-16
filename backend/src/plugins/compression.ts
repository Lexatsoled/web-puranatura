import { constants } from 'node:zlib';
import compress from '@fastify/compress';
import fp from 'fastify-plugin';
import { compressionConfig } from '../config/compression.js';

const plugin = fp(async (fastify) => {
  if (!compressionConfig.enabled) {
    fastify.log.info('HTTP compression deshabilitada por configuración');
    return;
  }

  await fastify.register(compress, {
    global: true,
    threshold: compressionConfig.threshold,
    encodings: compressionConfig.encodings,
    customTypes: compressionConfig.customTypes,
    brotliOptions: {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: compressionConfig.brotliQuality,
      },
    },
    zlibOptions: {
      level: compressionConfig.gzipLevel,
    },
  });

  fastify.log.info(
    {
      threshold: compressionConfig.threshold,
      brotliQuality: compressionConfig.brotliQuality,
      gzipLevel: compressionConfig.gzipLevel,
    },
    'Compression plugin registrado (Brotli/Gzip)',
  );
}, { name: 'compression-plugin' });

export const compressionPlugin = plugin;
export default plugin;
