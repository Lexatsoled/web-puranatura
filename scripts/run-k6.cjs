#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const version = process.env.K6_VERSION || '0.52.0';
console.log(`[k6] Wrapper iniciado (version ${version})`);

const platformMap = { win32: 'windows', linux: 'linux', darwin: 'macos' };
const archMap = { x64: 'amd64', arm64: 'arm64' };
const platform = platformMap[process.platform];
const arch = archMap[process.arch] || 'amd64';

if (!platform) {
  console.error(`[k6] Plataforma no soportada: ${process.platform}`);
  process.exit(1);
}

const cacheDir = path.join(os.tmpdir(), 'puranatura-k6');
const binaryName = process.platform === 'win32' ? 'k6.exe' : 'k6';
const baseDir =
  process.platform === 'win32'
    ? path.join(cacheDir, `k6-v${version}-windows-${arch}`)
    : cacheDir;
const cachedBinary = path.join(baseDir, binaryName);

const hasBinary = () => {
  if (!fs.existsSync(cachedBinary)) return false;
  const res = spawnSync(cachedBinary, ['version'], { stdio: 'ignore' });
  return res.status === 0;
};

const trySystemBinary = () => {
  const res = spawnSync(binaryName, ['version'], { stdio: 'ignore' });
  return res.status === 0 ? binaryName : null;
};

const downloadBinary = () => {
  fs.mkdirSync(cacheDir, { recursive: true });
  const isWin = process.platform === 'win32';
  const asset = isWin
    ? `k6-v${version}-windows-${arch}.zip`
    : `k6-v${version}-${platform}-${arch}.tar.gz`;
  const url = `https://github.com/grafana/k6/releases/download/v${version}/${asset}`;
  console.log(`[k6] Descargando ${asset}...`);

  if (isWin) {
    const zipPath = path.join(cacheDir, asset);
    const psCommand = [
      `$ProgressPreference='SilentlyContinue';`,
      `Invoke-WebRequest -Uri '${url}' -OutFile '${zipPath}'`,
      `; Expand-Archive -Force '${zipPath}' '${cacheDir}'`,
    ].join(' ');
    const result = spawnSync(
      'powershell.exe',
      ['-NoProfile', '-Command', psCommand],
      {
        stdio: 'inherit',
      }
    );
    if (result.status !== 0)
      throw new Error('No se pudo descargar k6 en Windows');
  } else {
    const result = spawnSync(
      'bash',
      [
        '-c',
        `curl -sSL "${url}" | tar -xz -C "${cacheDir}" --strip-components=1`,
      ],
      { stdio: 'inherit' }
    );
    if (result.status !== 0) throw new Error('No se pudo descargar k6');
  }

  fs.chmodSync(cachedBinary, 0o755);
  return cachedBinary;
};

const resolveBinary = () => {
  const systemBinary = trySystemBinary();
  if (systemBinary) {
    console.log('[k6] Se usara binario del sistema');
    return systemBinary;
  }
  if (hasBinary()) {
    console.log('[k6] Se usara binario cacheado');
    return cachedBinary;
  }
  console.log('[k6] Binario no encontrado, descargando...');
  return downloadBinary();
};

const run = async () => {
  const binary = resolveBinary();
  console.log(`[k6] Usando binario: ${binary}`);

  const userArgs = process.argv.slice(2);
  const defaultArgs = ['run', 'GPT-51-Codex-Max/perf/k6-api-smoke.js'];
  const args =
    userArgs.length === 0
      ? defaultArgs
      : userArgs[0] === 'run'
        ? userArgs
        : ['run', ...userArgs];

  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  const strict = process.env.PERF_API_STRICT === 'true';

  const canReach = () =>
    new Promise((resolve) => {
      const mod = baseUrl.startsWith('https')
        ? require('https')
        : require('http');
      const req = mod.get(baseUrl, { timeout: 3000 }, (res) => {
        res.resume();
        resolve(res.statusCode < 500);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
    });

  const reachable = await canReach();
  if (!reachable && !strict) {
    console.warn(
      `[k6] Backend (${baseUrl}) no accesible. Se omite perf:api (PERF_API_STRICT=false).`
    );
    process.exit(0);
  }

  if (!reachable && strict) {
    console.error(
      `[k6] Backend (${baseUrl}) no accesible. Activa el servidor o deshabilita PERF_API_STRICT.`
    );
    process.exit(1);
  }

  const result = spawnSync(binary, args, {
    stdio: 'inherit',
    env: { ...process.env, BASE_URL: baseUrl },
  });

  if (result.status !== 0) {
    console.error(
      `[k6] Salida con codigo ${result.status ?? 'desconocido'}. ${
        result.error ? result.error.message : ''
      }`
    );
  }
  process.exit(result.status ?? 1);
};

run().catch((error) => {
  console.error('[k6] Error:', error.message || error);
  process.exit(1);
});
