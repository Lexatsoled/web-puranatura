const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..'); // Assuming script is in /tools or root/scripts
const outputFile = path.join(rootDir, 'inventory.json');

const ignoredDirs = ['node_modules', '.git', 'dist', 'coverage', '.lighthouseci'];

function getFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return 'sha256:' + hashSum.digest('hex').substring(0, 16) + '...'; // Truncated for verify
  } catch (e) {
    return 'error';
  }
}

function scanDir(dir, moduleName) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (ignoredDirs.includes(file)) return;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(scanDir(filePath, moduleName));
    } else {
      results.push({
        path: path.relative(rootDir, filePath).replace(/\\/g, '/'),
        size: stat.size,
        lang: path.extname(file).substring(1),
        // hash: getFileHash(filePath), // Performance: skip hash for now or limit
        module_id: moduleName
      });
    }
  });
  return results;
}

const inventory = {
  scanned_at: new Date().toISOString(),
  root: path.basename(rootDir),
  files: [],
  modules: [
    { id: 'root', description: 'Configuraciones raiz', files: [] },
    { id: 'frontend', description: 'Frontend React/Vite', files: [] },
    { id: 'backend', description: 'Backend Node/Express', files: [] },
    { id: 'docs', description: 'Documentacion', files: [] }
  ]
};

// Scan Root (non-recursive for simplicity looking for top level, but actually we want all)
// We will splitting by known structure
inventory.files = inventory.files.concat(scanDir(path.join(rootDir, 'src'), 'frontend'));
inventory.files = inventory.files.concat(scanDir(path.join(rootDir, 'backend'), 'backend'));
inventory.files = inventory.files.concat(scanDir(path.join(rootDir, 'docs'), 'docs'));

// Scan root files manually
const rootFiles = fs.readdirSync(rootDir).filter(f => fs.statSync(path.join(rootDir, f)).isFile());
rootFiles.forEach(f => {
    inventory.files.push({
        path: f,
        size: fs.statSync(path.join(rootDir, f)).size,
        lang: path.extname(f).substring(1),
        module_id: 'root'
    });
});

fs.writeFileSync(outputFile, JSON.stringify(inventory, null, 2));
console.log('Inventory generated at ' + outputFile);
