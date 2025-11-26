import { once } from 'node:events';
import { mkdir, writeFile } from 'node:fs/promises';
import appPackage from '../backend/src/app.ts';
const { app, closeApp } = appPackage;

const port = 4001;
const baseUrl = `http://127.0.0.1:${port}`;

const startServer = async () => {
  const server = app.listen(port);
  await once(server, 'listening');
  return server;
};

const fetchWithTimeout = async (path: string, init?: RequestInit) => {
  const response = await fetch(`${baseUrl}${path}`, init);
  if (!response.ok && response.status !== 304) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response;
};

const main = async () => {
  const server = await startServer();
  try {
    await fetchWithTimeout('/');
    await fetchWithTimeout('/api/health');

    const productResponse = await fetchWithTimeout(
      '/api/products?page=1&pageSize=5'
    );
    const etag = productResponse.headers.get('etag');
    if (etag) {
      await fetchWithTimeout('/api/products?page=1&pageSize=5', {
        headers: { 'If-None-Match': etag },
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const metricsResponse = await fetchWithTimeout('/metrics');
    const metricsText = await metricsResponse.text();
    await mkdir('reports/observability', { recursive: true });
    await writeFile(
      'reports/observability/metrics-snapshot.txt',
      metricsText,
      'utf-8'
    );
    console.log(
      'Captura de metrics guardada en reports/observability/metrics-snapshot.txt'
    );
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    await closeApp();
  }
};

main().catch((error) => {
  console.error(
    'Error al generar snapshot de métricas:',
    error instanceof Error ? error.stack : error
  );
  process.exit(1);
});
