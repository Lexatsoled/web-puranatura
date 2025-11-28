#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const version = process.env.TRIVY_VERSION || '0.51.4';
console.log(`[trivy] Wrapper iniciado (version ${version})`);
const platformMap = { win32: 'Windows', linux: 'Linux', darwin: 'macOS' };
const archMap = { x64: '64bit', arm64: 'ARM64', arm: 'ARM' };
const platform = platformMap[process.platform];
const arch = archMap[process.arch] || archMap.x64;

if (!platform) {
  console.error(`[trivy] Plataforma no soportada: ${process.platform}`);
  process.exit(1);
}

const cacheDir = path.join(os.tmpdir(), 'puranatura-trivy');
const binaryName = process.platform === 'win32' ? 'trivy.exe' : 'trivy';
const cachedBinary = path.join(cacheDir, binaryName);

const hasBinary = () => {
  if (!fs.existsSync(cachedBinary)) return false;
  const res = spawnSync(cachedBinary, ['--version'], { stdio: 'ignore' });
  return res.status === 0;
};

const trySystemBinary = () => {
  const cmd = process.platform === 'win32' ? `${binaryName}` : binaryName;
  const res = spawnSync(cmd, ['--version'], { stdio: 'ignore' });
  return res.status === 0 ? cmd : null;
};

const downloadBinary = () => {
  fs.mkdirSync(cacheDir, { recursive: true });
  const isWin = process.platform === 'win32';
  const asset = isWin
    ? `trivy_${version}_${platform}-${arch}.zip`
    : `trivy_${version}_${platform}-${arch}.tar.gz`;
  const url = `https://github.com/aquasecurity/trivy/releases/download/v${version}/${asset}`;
  console.log(`[trivy] Descargando ${asset}...`);

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
    if (result.status !== 0) {
      throw new Error('No se pudo descargar trivy en Windows');
    }
  } else {
    const result = spawnSync(
      'bash',
      [
        '-c',
        `curl -sSL "${url}" | tar -xz -C "${cacheDir}" --strip-components=1`,
      ],
      { stdio: 'inherit' }
    );
    if (result.status !== 0) {
      throw new Error('No se pudo descargar trivy');
    }
  }

  // Ensure we actually found a binary at the expected path.
  let extractedBinary = cachedBinary;
  if (!fs.existsSync(extractedBinary)) {
    // Fallback: search recursively for a file named like the binary
    const findBinary = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          const found = findBinary(full);
          if (found) return found;
        } else if (e.isFile() && e.name === binaryName) {
          return full;
        }
      }
      return null;
    };

    const found = findBinary(cacheDir);
    if (!found) {
      throw new Error('No se encontró el binario trivy después de extraer el fichero');
    }
    extractedBinary = found;
  }

  fs.chmodSync(extractedBinary, 0o755);
  return extractedBinary;
};

const resolveBinary = () => {
  const systemBinary = trySystemBinary();
  if (systemBinary) {
    console.log('[trivy] Se usará binario del sistema');
    return systemBinary;
  }
  if (hasBinary()) {
    console.log('[trivy] Se usará binario cacheado');
    return cachedBinary;
  }
  console.log('[trivy] Binario no encontrado, descargando...');
  return downloadBinary();
};

try {
  const binary = resolveBinary();
  console.log(`[trivy] Usando binario: ${binary}`);
  const args = process.argv.slice(2);
  const defaultArgs = [
    'fs',
    '.',
    '--scanners',
    'vuln,secret',
    '--severity',
    'HIGH,CRITICAL',
  ];

  const result = spawnSync(binary, args.length ? args : defaultArgs, {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    console.error(
      `[trivy] Salida con código ${result.status ?? 'desconocido'}. ${
        result.error ? result.error.message : ''
      }`
    );
  }

  process.exit(result.status ?? 1);
} catch (error) {
  console.error('[trivy] Error:', error.message || error);
  process.exit(1);
}
