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

  const fetchLogin = () =>
    new Promise((resolve, reject) => {
      const body = JSON.stringify({ username: 'contract', password: 'contract-dummy-pass' });
      const req = http.request(
        {
          hostname: HOST,
          port,
          path: '/api/auth/login',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            Accept: 'application/json',
          },
          timeout: 5000,
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
                  `Respuesta inesperada de /api/auth/login: ${res.statusCode} ${Buffer.concat(chunks).toString()}`
                )
              );
            }
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout consultando /api/auth/login del mock'));
      });
      req.write(body);
      req.end();
    });

  const fetchRefresh = () =>
    new Promise((resolve, reject) => {
      const body = JSON.stringify({ refreshToken: 'contract-refresh-dummy' });
      const req = http.request(
        {
          hostname: HOST,
          port,
          path: '/api/auth/refresh',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            Accept: 'application/json',
          },
          timeout: 5000,
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
                  `Respuesta inesperada de /api/auth/refresh: ${res.statusCode} ${Buffer.concat(chunks).toString()}`
                )
              );
            }
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout consultando /api/auth/refresh del mock'));
      });
      req.write(body);
      req.end();
    });

  const fetchLogout = () =>
    new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: HOST,
          port,
          path: '/api/auth/logout',
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer contract-mock-dummy',
            Cookie: 'token=contract-mock-dummy',
          },
          timeout: 5000,
        },
        (res) => {
          if (res.statusCode && (res.statusCode === 204 || res.statusCode < 300)) {
            resolve();
          } else {
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () =>
              reject(
                new Error(
                  `Respuesta inesperada de /api/auth/logout: ${res.statusCode} ${Buffer.concat(chunks).toString()}`
                )
              )
            );
          }
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout consultando /api/auth/logout del mock'));
      });
      req.end();
    });

  const fetchOrders = () =>
    new Promise((resolve, reject) => {
      const req = http.get(
        {
          hostname: HOST,
          port,
          path: '/api/orders',
          timeout: 5000,
          headers: {
            Accept: 'application/json',
            Cookie: 'token=contract-mock-dummy',
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
                  `Respuesta inesperada de /api/orders: ${res.statusCode} ${Buffer.concat(chunks).toString()}`
                )
              );
            }
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout consultando /api/orders del mock'));
      });
    });

  const fetchCreateOrder = () =>
    new Promise((resolve, reject) => {
      const body = JSON.stringify({ items: [{ productId: 'abc', quantity: 1 }] });
      const req = http.request(
        {
          hostname: HOST,
          port,
          path: '/api/orders',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            Accept: 'application/json',
            Cookie: 'token=contract-mock-dummy',
          },
          timeout: 5000,
        },
        (res) => {
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => {
            if (res.statusCode && (res.statusCode === 201 || res.statusCode < 300)) {
              resolve();
            } else {
              reject(
                new Error(
                  `Respuesta inesperada de POST /api/orders: ${res.statusCode} ${Buffer.concat(chunks).toString()}`
                )
              );
            }
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout creando orden en /api/orders del mock'));
      });
      req.write(body);
      req.end();
    });

  const fetchGetCart = () =>
    new Promise((resolve, reject) => {
      const req = http.get(
        {
          hostname: HOST,
          port,
          path: '/api/cart',
          timeout: 5000,
          headers: {
            Accept: 'application/json',
            Cookie: 'token=contract-mock-dummy',
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
                  `Respuesta inesperada de /api/cart: ${res.statusCode} ${Buffer.concat(chunks).toString()}`
                )
              );
            }
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout consultando /api/cart del mock'));
      });
    });

  const fetchAddCartItem = () =>
    new Promise((resolve, reject) => {
      const body = JSON.stringify({ productId: 'abc', quantity: 1 });
      const req = http.request(
        {
          hostname: HOST,
          port,
          path: '/api/cart',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            Accept: 'application/json',
            Cookie: 'token=contract-mock-dummy',
          },
          timeout: 5000,
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
                  `Respuesta inesperada de POST /api/cart: ${res.statusCode} ${Buffer.concat(chunks).toString()}`
                )
              );
            }
          });
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout añadiendo item a /api/cart del mock'));
      });
      req.write(body);
      req.end();
    });

  try {
    await waitForReady();
    await fetchHealth();
    await fetchProducts();
    await fetchLogin();
    await fetchRefresh();
    await fetchLogout();
    // Orders + cart smoke tests
    await fetchOrders();
    await fetchCreateOrder();
    await fetchGetCart();
    await fetchAddCartItem();
    shutdown(0);
  } catch (error) {
    console.error('[test:contract] Error:', error.message || error);
    shutdown(1);
  }
};

run();
