#!/usr/bin/env node
/**
 * Ejecuta una verificación rápida de contratos:
 * - Levanta un mock server con Prism usando el OpenAPI.
 * - Hace una petición GET /api/health contra el mock.
 * - Apaga el servidor y devuelve 0 si todo fue OK.
 *
 * Esto evita tener que pasar argumentos en cada plataforma y asegura
 * que el OpenAPI se puede servir sin errores.
 */
const { spawn } = require('node:child_process');
const http = require('node:http');
const net = require('node:net');

const HOST = '127.0.0.1';
const specPath = 'GPT-51-Codex-Max/api/openapi.yaml';

const getPort = () =>
  new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, HOST, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });

const run = async () => {
  const port =
    Number(process.env.CONTRACT_PORT) > 0
      ? Number(process.env.CONTRACT_PORT)
      : await getPort();

  const prismArgs = [
    '--yes',
    '@stoplight/prism-cli',
    'mock',
    specPath,
    '-h',
    HOST,
    '-p',
    String(port),
  ];

  const prism = spawn('npx', prismArgs, {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const shutdown = (code) => {
    prism.kill();
    setTimeout(() => process.exit(code), 500);
  };

  const waitForReady = () =>
    new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('Prism no arrancó a tiempo')),
        30_000
      );
      const onData = (data) => {
        const msg = data.toString();
        process.stdout.write(msg);
        if (msg.includes('Prism is listening')) {
          clearTimeout(timeout);
          resolve();
        }
      };
      const onErr = (data) => process.stderr.write(data.toString());
      prism.stdout.on('data', onData);
      prism.stderr.on('data', onErr);
      prism.on('error', reject);
    });

  const fetchHealth = () =>
    new Promise((resolve, reject) => {
      const req = http.get(
        {
          hostname: HOST,
          port,
          path: '/api/health',
          timeout: 5000,
          headers: {
            Cookie: 'token=mock',
            Accept: 'application/json',
          },
        },
        (res) => {
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => {
            if (res.statusCode && res.statusCode < 300) {
              resolve();
            } else {
              reject(
                new Error(
                  `Respuesta inesperada: ${res.statusCode} ${Buffer.concat(
                    chunks
                  ).toString()}`
                )
              );
            }
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout consultando /api/health del mock'));
      });
    });

  const fetchProducts = () =>
    new Promise((resolve, reject) => {
      const req = http.get(
        {
          hostname: HOST,
          port,
          path: '/api/products?page=1&pageSize=2',
          timeout: 5000,
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer contract-mock',
            Cookie: 'token=contract-mock-token',
          },
        },
        (res) => {
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => {
            if (res.statusCode && res.statusCode < 300) {
              resolve();
            } else {
              reject(
                new Error(
                  `Respuesta inesperada de /api/products: ${res.statusCode} ${Buffer.concat(chunks).toString()}`
                )
              );
            }
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout consultando /api/products del mock'));
      });
    });

  try {
    await waitForReady();
    await fetchHealth();
    await fetchProducts();
    shutdown(0);
  } catch (error) {
    console.error('[test:contract] Error:', error.message || error);
    shutdown(1);
  }
};

run();
