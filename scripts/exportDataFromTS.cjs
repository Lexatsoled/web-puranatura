const fs = require('fs');
const path = require('path');

const root = process.cwd();
const productsTs = path.join(root, 'src', 'data', 'products.ts');
const blogTs = path.join(root, 'src', 'data', 'blog.ts');
const outDir = path.join(root, 'public', 'data');

function safeRead(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return '';
  }
}

function exportProducts() {
  const txt = safeRead(productsTs);
  const ids = new Set();
  const idRegex = /\bid\s*:\s*["']([^"']+)["']\s*,/g;
  let m;
  while ((m = idRegex.exec(txt)) !== null) ids.add(m[1]);
  return Array.from(ids).map((id) => ({ id }));
}

function exportBlog() {
  const txt = safeRead(blogTs);
  const posts = [];
  const itemRegex =
    /{[\s\S]*?id\s*:\s*['"]([^'"]+)['"][\s\S]*?(slug\s*:\s*['"]([^'"]+)['"])?.*?}/g;
  let m;
  while ((m = itemRegex.exec(txt)) !== null) {
    const id = m[1];
    const slug = m[3] || id;
    posts.push({ id, slug });
  }
  return posts;
}

function main() {
  const products = exportProducts();
  const blogPosts = exportBlog();
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'products.json'),
    JSON.stringify({ products }, null, 2),
    'utf8'
  );
  fs.writeFileSync(
    path.join(outDir, 'blog.json'),
    JSON.stringify({ blogPosts }, null, 2),
    'utf8'
  );
  console.log(
    `Exported ${products.length} products and ${blogPosts.length} blog posts to /public/data`
  );
}

main();
