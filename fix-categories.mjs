import fs from 'fs';

const filePath = './data/products.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazar category: 'valor' por categories: ['valor']
content = content.replace(/category:\s*'([^']+)'/g, "categories: ['$1']");

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Convertido category → categories en todos los productos');
