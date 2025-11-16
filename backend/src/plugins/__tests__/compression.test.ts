import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import compressionPlugin from '../compression.js';

const LARGE_TEXT = 'x'.repeat(4096);
const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  ${'<circle cx="50" cy="50" r="40" fill="green" />'.repeat(200)}
</svg>`;

describe('compressionPlugin', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = Fastify();
    await app.register(compressionPlugin);

    app.get('/large', async () => LARGE_TEXT);
    app.get('/small', async () => 'tiny');
    app.get('/svg', async (_request: FastifyRequest, reply: FastifyReply) =>
      reply.type('image/svg+xml').send(SVG_CONTENT),
    );
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('comprime respuestas mayores al umbral usando gzip cuando el cliente no soporta brotli', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/large',
      headers: {
        'accept-encoding': 'gzip',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-encoding']).toBe('gzip');
    expect(response.rawPayload.length).toBeLessThan(Buffer.byteLength(LARGE_TEXT));

    const decoded = gunzipSync(response.rawPayload).toString('utf8');
    expect(decoded).toBe(LARGE_TEXT);
  });

  it('prefiere brotli cuando el cliente lo soporta', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/large',
      headers: {
        'accept-encoding': 'br, gzip',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-encoding']).toBe('br');

    const decoded = brotliDecompressSync(response.rawPayload).toString('utf8');
    expect(decoded).toBe(LARGE_TEXT);
  });

  it('no comprime cuando la respuesta es menor al umbral configurado', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/small',
      headers: {
        'accept-encoding': 'br, gzip',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-encoding']).toBeUndefined();
  });

  it('configura el encabezado Content-Encoding para tipos SVG soportados', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/svg',
      headers: {
        'accept-encoding': 'gzip',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-encoding']).toBe('gzip');
    const decoded = gunzipSync(response.rawPayload).toString('utf8');
    expect(decoded).toContain('<svg');
  });
});
