const { join } = require('path');
const { promises: fs } = require('fs');
const AdmZip = require('adm-zip');

const baseDir = join('reports', 'observability');
const requiredFiles = [
  'metrics-snapshot.txt',
  'trace-sample.md',
  'perf-summary.md',
  'collect-metrics-server.log',
  'collect-metrics-server.stderr.log',
  'collect-metrics-server.stdout.log',
];
const zipName = 'observability-artifacts.zip';

const checkFiles = async () => {
  const missing = [];
  for (const file of requiredFiles) {
    try {
      await fs.access(join(baseDir, file));
    } catch {
      missing.push(file);
    }
  }
  return missing;
};

const checkZip = async () => {
  try {
    const zipPath = join(baseDir, zipName);
    const zip = new AdmZip(zipPath);
    const entries = zip.getEntries().map((entry) => entry.entryName);
    const missing = requiredFiles.filter(
      (file) => !entries.some((entry) => entry.endsWith(file))
    );
    return missing;
  } catch (error) {
    throw new Error(`Fallo al abrir ${zipName}: ${error.message}`);
  }
};

const main = async () => {
  const missingFiles = await checkFiles();
  if (missingFiles.length > 0) {
    console.warn('Faltan archivos individuales:', missingFiles.join(', '));
  } else {
    console.log('Todos los artefactos individuales están presentes.');
  }

  try {
    const missingZip = await checkZip();
    if (missingZip.length > 0) {
      console.warn(
        `Faltan en ${zipName}: ${missingZip.length} archivos idénticos (${missingZip.join(
          ', '
        )})`
      );
    } else {
      console.log(`${zipName} contiene todos los archivos esperados.`);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  if (missingFiles.length > 0) process.exit(1);
};

main().catch((error) => {
  console.error('Error verificando artefactos:', error);
  process.exit(1);
});
