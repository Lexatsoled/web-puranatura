#!/usr/bin/env node
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const versionTag = process.env.GITLEAKS_VERSION || 'v8.29.1';
const version = versionTag.replace(/^v/, '');
const platformMap = { win32: 'windows', linux: 'linux', darwin: 'darwin' };
const archMap = { x64: 'x64', arm64: 'arm64' };

const platform = platformMap[process.platform];
const arch = archMap[process.arch] || 'x64';
const ext = process.platform === 'win32' ? 'zip' : 'tar.gz';

if (!platform) {
  console.error(`[gitleaks] Plataforma no soportada: ${process.platform}`);
  process.exit(1);
}

const cacheDir = path.join(os.tmpdir(), 'puranatura-gitleaks');
const binaryName = process.platform === 'win32' ? 'gitleaks.exe' : 'gitleaks';
const cachedBinary = path.join(cacheDir, binaryName);

const hasBinary = () => {
  try {
    execFileSync(cachedBinary, ['version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const trySystemBinary = () => {
  try {
    execFileSync('gitleaks', ['version'], { stdio: 'ignore' });
    return 'gitleaks';
  } catch {
    return null;
  }
};

const downloadBinary = () => {
  fs.mkdirSync(cacheDir, { recursive: true });
  const asset = `gitleaks_${version}_${platform}_${arch}.${ext}`;
  const url = `https://github.com/gitleaks/gitleaks/releases/download/v${version}/${asset}`;

  console.log(`[gitleaks] Descargando ${asset}...`);
  if (process.platform === 'win32') {
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
    if (result.status !== 0) {
      throw new Error('No se pudo descargar gitleaks en Windows');
    }
  } else {
    const result = spawnSync(
      'bash',
      ['-c', `curl -sSL "${url}" | tar -xz -C "${cacheDir}"`],
      { stdio: 'inherit' }
    );
    if (result.status !== 0) {
      throw new Error('No se pudo descargar gitleaks en Unix');
    }
  }

  fs.chmodSync(cachedBinary, 0o755);
  return cachedBinary;
};

const resolveBinary = () => {
  const systemBinary = trySystemBinary();
  if (systemBinary) return systemBinary;
  if (hasBinary()) return cachedBinary;
  return downloadBinary();
};

const binary = resolveBinary();
const args = process.argv.slice(2);
const defaultReportPath = path.join('reports', 'gitleaks-report.json');
const defaultArgs = [
  'detect',
  '--no-banner',
  '--redact',
  '--source',
  '.',
  '--no-git',
  '--config',
  path.join('.github', '.gitleaks.toml'),
  '--report-format',
  'json',
  '--report-path',
  defaultReportPath,
];

fs.mkdirSync(path.dirname(defaultReportPath), { recursive: true });

try {
  execFileSync(binary, args.length ? args : defaultArgs, {
    stdio: 'inherit',
    env: { ...process.env, GITLEAKS_BINARY: binary, HOME: os.homedir() },
  });
} catch (error) {
  if (error.status) {
    process.exit(error.status);
  }
  console.error('[gitleaks] Fallo al ejecutar el escaneo:', error);
  process.exit(1);
}
