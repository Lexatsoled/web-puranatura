import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const filePath = path.resolve(projectRoot, 'src/data/products.ts');

console.log(`Reading file from: ${filePath}`);

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Regex to find the end of a scientificReferences array followed by a duplicate key
  const regex = /],\s*scientificReferences:\s*\[/g;
  const replacement = ',';

  if (regex.test(data)) {
    const correctedData = data.replace(regex, replacement);

    fs.writeFile(filePath, correctedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing the corrected file:', writeErr);
        return;
      }
      console.log('Successfully fixed the product data file!');
    });
  } else {
    console.log('No duplicate scientificReferences found to fix.');
  }
});
