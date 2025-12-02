import { once } from 'node:events';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { request } from 'undici';

const PORT = Number(process.env.SYNTHETIC_PORT ?? 4004);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SMOKE_USER = process.env.SMOKE_USER ?? 'smoke@puranatura.test';
const SMOKE_PASS = process.env.SMOKE_PASS ?? 'SmokeP@ss123';

type StepResult = {
  name: string;
  durationMs: number;
  statusCode?: number;
  success: boolean;
  detail?: string;
  data?: unknown;
};

const cookieJar = new Map<string, string>();

const updateCookies = (setCookieHeader: string | string[] | undefined) => {
  if (!setCookieHeader) return;
  const entries = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];
  for (const entry of entries) {
    const [pair] = entry.split(';');
    const [name, ...rest] = pair.split('=');
    if (!name) continue;
    const value = rest.join('=');
    if (value.length === 0) {
      cookieJar.delete(name.trim());
    } else {
      cookieJar.set(name.trim(), value.trim());
    }
  }
};

const getCookieHeader = () =>
  [...cookieJar.entries()].map(([key, value]) => `${key}=${value}`).join('; ');

const readBody = (stream: any) =>
  new Promise<string>((resolve, reject) => {
    let payload = '';
    stream.setEncoding('utf8');
    stream.on('data', (chunk: string) => {
      payload += chunk;
    });
    stream.on('end', () => resolve(payload));
    stream.on('error', (error: Error) => reject(error));
  });

const stepResults: StepResult[] = [];

const runRequest = async (
  name: string,
  path: string,
  options: {
    method?: 'GET' | 'POST';
    body?: unknown;
    headers?: Record<string, string>;
    expectStatus?: number;
  } = {}
) => {
  const { method = 'GET', body, headers = {}, expectStatus } = options;
  const start = Date.now();
  try {
    const url = `${BASE_URL}${path}`;
    const requestOptions: {
      method: string;
      headers: Record<string, string>;
      body?: string;
    } = {
      method,
      headers: {
        ...headers,
        cookie: getCookieHeader(),
      },
    };
    if (body !== undefined) {
      requestOptions.headers['content-type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
    const response = await request(url, requestOptions);
    updateCookies(response.headers['set-cookie']);
    const text = await readBody(response.body);
    const parsed =
      text.length > 0
        ? (() => {
            try {
              return JSON.parse(text);
            } catch {
              return text;
            }
          })()
        : undefined;
    const durationMs = Date.now() - start;
    const ok =
      expectStatus !== undefined
        ? response.statusCode === expectStatus
        : response.statusCode >= 200 && response.statusCode < 300;
    const detailParts: string[] = [];
    if (typeof parsed === 'object' && parsed && 'message' in parsed) {
      detailParts.push(String((parsed as any).message));
    }
    detailParts.push(
      `statusCode=${response.statusCode}`,
      `durationMs=${durationMs}`
    );
    stepResults.push({
      name,
      durationMs,
      statusCode: response.statusCode,
      success: ok,
      detail: detailParts.join(' | '),
      data: parsed,
    });
    return { response, parsed, headers: response.headers };
  } catch (error) {
    const durationMs = Date.now() - start;
    stepResults.push({
      name,
      durationMs,
      success: false,
      detail: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};

const runChecks = async () => {
  await runRequest('health', '/api/health');
  const csrfToken = cookieJar.get('csrfToken');
  if (!csrfToken) {
    throw new Error('No se recibió csrfToken en la cookie');
  }
  await runRequest('login', '/api/auth/login', {
    method: 'POST',
    body: { email: SMOKE_USER, password: SMOKE_PASS },
    headers: { 'x-csrf-token': csrfToken },
    expectStatus: 200,
  });
  const catalog = await runRequest(
    'catalog',
    '/api/products?page=1&pageSize=5'
  );
  const etag = (() => {
    const raw = catalog.headers['etag'];
    if (typeof raw === 'string') return raw;
    if (Array.isArray(raw)) return raw[0];
    return undefined;
  })();
  if (etag) {
    await runRequest('catalog-cache', '/api/products?page=1&pageSize=5', {
      headers: { 'if-none-match': etag },
      expectStatus: 304,
    });
  }
  const products = Array.isArray(catalog.parsed) ? catalog.parsed : [];
  const candidate =
    products.find(
      (item: any) => typeof item.stock === 'number' && item.stock > 0
    ) ?? products[0];
  await runRequest('orders-list', '/api/orders');
  if (candidate && candidate.id) {
    await runRequest('checkout', '/api/orders', {
      method: 'POST',
      headers: { 'x-csrf-token': csrfToken },
      body: { items: [{ productId: candidate.id, quantity: 1 }] },
      expectStatus: 201,
    });
  }
};

const startBackendProcess = () => {
  const env = {
    ...process.env,
    PORT: String(PORT),
    NODE_ENV: 'development',
  };
  const child = spawn('npx', ['--yes', 'ts-node', 'src/server.ts'], {
    cwd: 'backend',
    env,
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: process.platform === 'win32',
  });
  child.on('error', (error) => {
    console.error('No se pudo iniciar el backend para sintéticos:', error);
  });
  return child;
};

const waitForServer = async () => {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    try {
      const response = await request(`${BASE_URL}/api/health`, {
        method: 'GET',
      });
      await readBody(response.body);
      if (response.statusCode === 200) {
        return;
      }
    } catch {
      // ignore rejections while waiting
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('Backend no respondió /api/health en el tiempo esperado');
};

const main = async () => {
  const backendProcess = startBackendProcess();
  try {
    await waitForServer();
    await runChecks();
  } finally {
    backendProcess.kill();
    try {
      await once(backendProcess, 'exit');
    } catch {
      // ignore
    }
  }
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    smokeUser: SMOKE_USER,
    steps: stepResults,
  };
  await mkdir('reports/synthetic', { recursive: true });
  await writeFile(
    'reports/synthetic/synthetic-report.json',
    JSON.stringify(report, null, 2),
    'utf-8'
  );
  console.log(
    'Synthetic report guardado en reports/synthetic/synthetic-report.json'
  );
};

main().catch((error) => {
  console.error('Synthetic checks fallaron:', error);
  process.exit(1);
});
