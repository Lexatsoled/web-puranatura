const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = process.cwd();
const outputFile = path.join(rootDir, 'inventory.json');

const ignoredDirs = [
  'node_modules',
  '.git',
  'dist',
  'coverage',
  '.lighthouseci',
  'tmp',
  '.husky',
  'test-results',
  'playwright-report',
  'reports',
];

function getFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return 'sha256:' + hashSum.digest('hex');
  } catch (e) {
    return 'error:' + e.message;
  }
}

function scanDir(dir, moduleName) {
  let results = [];
  try {
    if (!fs.existsSync(dir)) return [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      if (ignoredDirs.includes(file)) return;
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
          results = results.concat(scanDir(filePath, moduleName));
        } else {
          results.push({
            path: path.relative(rootDir, filePath).replace(/\\/g, '/'),
            size: stat.size,
            lang: path.extname(file).substring(1),
            hash: getFileHash(filePath),
            module_id: moduleName,
          });
        }
      } catch (e) {}
    });
  } catch (e) {}
  return results;
}

const inventory = {
  scanned_at: new Date().toISOString(),
  root: path.basename(rootDir),
  files: [],
  modules: [
    { id: 'root', description: 'Configuraciones raiz', files: [] },
    { id: 'frontend-core', description: 'Frontend Code (src)', files: [] },
    { id: 'backend-core', description: 'Backend Code (backend)', files: [] },
    { id: 'scripts', description: 'Scripts y Tooling', files: [] },
    { id: 'e2e', description: 'Pruebas E2E', files: [] },
    { id: 'docs', description: 'Documentacion', files: [] },
    { id: 'infra', description: 'Infraestructura', files: [] },
  ],
};

// Scan Modules
inventory.files = inventory.files.concat(
  scanDir(path.join(rootDir, 'src'), 'frontend-core')
);
inventory.files = inventory.files.concat(
  scanDir(path.join(rootDir, 'backend'), 'backend-core')
);
inventory.files = inventory.files.concat(
  scanDir(path.join(rootDir, 'scripts'), 'scripts')
);
inventory.files = inventory.files.concat(
  scanDir(path.join(rootDir, 'e2e'), 'e2e')
);
inventory.files = inventory.files.concat(
  scanDir(path.join(rootDir, 'docs'), 'docs')
);
inventory.files = inventory.files.concat(
  scanDir(path.join(rootDir, 'infra'), 'infra')
);

// Root files
try {
  const rootFiles = fs.readdirSync(rootDir).filter((f) => {
    try {
      return fs.statSync(path.join(rootDir, f)).isFile();
    } catch {
      return false;
    }
  });
  rootFiles.forEach((f) => {
    const filePath = path.join(rootDir, f);
    inventory.files.push({
      path: f,
      size: fs.statSync(filePath).size,
      lang: path.extname(f).substring(1),
      hash: getFileHash(filePath),
      module_id: 'root',
    });
  });
} catch (e) {}

fs.writeFileSync(outputFile, JSON.stringify(inventory, null, 2));
console.log('Inventory generated at ' + outputFile);
