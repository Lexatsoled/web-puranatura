import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://web.purezanaturalis.com';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

function xmlFor(urls: SitemapUrl[]): string {
  const body = urls
    .map((u) => {
      const parts = [
        `    <loc>${u.loc}</loc>`,
        u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : '',
        u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>` : '',
        u.priority !== undefined
          ? `    <priority>${u.priority.toFixed(1)}</priority>`
          : '',
      ]
        .filter(Boolean)
        .join('\n');
      return `  <url>\n${parts}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function readJson(rel: string) {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, rel), 'utf8'));
  } catch {
    return null;
  }
}

async function loadProducts() {
  return readJson('../public/data/products.json')?.products || [];
}
async function loadBlogPosts() {
  return readJson('../public/data/blog.json')?.blogPosts || [];
}

async function buildUrls(): Promise<SitemapUrl[]> {
  const out: SitemapUrl[] = [];
  const d = today();
  const statics = [
    ['/', 'daily', 1.0],
    ['/tienda', 'daily', 0.9],
    ['/blog', 'weekly', 0.8],
    ['/servicios', 'monthly', 0.8],
    ['/sobre-nosotros', 'monthly', 0.7],
    ['/contacto', 'monthly', 0.7],
    ['/sistemas-sinergicos', 'weekly', 0.8],
  ] as const;
  statics.forEach(([p, cf, pr]) =>
    out.push({
      loc: `${SITE_URL}${p}`,
      lastmod: d,
      changefreq: cf,
      priority: pr,
    })
  );

  (await loadProducts()).forEach((p: Record<string, unknown>) => {
    if (p?.id)
      out.push({
        loc: `${SITE_URL}/producto/${p.id}`,
        lastmod: d,
        changefreq: 'weekly',
        priority: 0.7,
      });
  });
  (await loadBlogPosts()).forEach((b: Record<string, unknown>) => {
    const slug = b.slug || b.id;
    if (slug)
      out.push({
        loc: `${SITE_URL}/blog/${slug}`,
        lastmod: d,
        changefreq: 'monthly',
        priority: 0.6,
      });
  });

  ['profile', 'orders', 'addresses', 'wishlist'].forEach((page) =>
    out.push({
      loc: `${SITE_URL}/${page}`,
      lastmod: d,
      changefreq: 'monthly',
      priority: 0.3,
    })
  );
  return out;
}

async function main() {
  const urls = await buildUrls();
  fs.writeFileSync(OUTPUT_PATH, xmlFor(urls), 'utf8');
  console.log(`Sitemap (${urls.length} URLs) => ${OUTPUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
