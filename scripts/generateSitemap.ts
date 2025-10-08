/**
 * Sitemap Generator
 * 
 * Genera sitemap.xml dinámico con todas las rutas de la aplicación:
 * - Páginas estáticas (Home, Store, Blog, Services, etc.)
 * - Productos individuales (142 productos)
 * - Posts de blog
 * - Servicios
 * 
 * Incluye:
 * - Priority (0.1 - 1.0)
 * - Change frequency (always, hourly, daily, weekly, monthly, yearly, never)
 * - Last modified date
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const SITE_URL = 'https://web.purezanaturalis.com';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Genera el contenido XML del sitemap
 */
function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlsXML = urls.map(url => {
    let urlXML = `  <url>\n    <loc>${url.loc}</loc>\n`;
    
    if (url.lastmod) {
      urlXML += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    
    if (url.changefreq) {
      urlXML += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    
    if (url.priority !== undefined) {
      urlXML += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    }
    
    urlXML += `  </url>`;
    return urlXML;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;
}

/**
 * Obtiene la fecha actual en formato ISO (YYYY-MM-DD)
 */
function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Carga los productos desde el archivo de datos
 */
async function loadProducts() {
  try {
    // Importar dinámicamente para compatibilidad con ES modules
    const productsModule = await import('../src/data/products/all-products.js');
    return productsModule.products || [];
  } catch (error) {
    console.warn('⚠️  No se pudieron cargar los productos:', error);
    return [];
  }
}

/**
 * Carga los posts del blog
 */
async function loadBlogPosts() {
  try {
    const blogModule = await import('../src/data/blog.js');
    return blogModule.blogPosts || [];
  } catch (error) {
    console.warn('⚠️  No se pudieron cargar los posts del blog:', error);
    return [];
  }
}

/**
 * Genera las URLs del sitemap
 */
async function generateSitemapUrls(): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = [];
  const today = getCurrentDate();

  // 1. Páginas estáticas principales
  urls.push({
    loc: `${SITE_URL}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: 1.0,
  });

  urls.push({
    loc: `${SITE_URL}/store`,
    lastmod: today,
    changefreq: 'daily',
    priority: 0.9,
  });

  urls.push({
    loc: `${SITE_URL}/blog`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.8,
  });

  urls.push({
    loc: `${SITE_URL}/services`,
    lastmod: today,
    changefreq: 'monthly',
    priority: 0.8,
  });

  urls.push({
    loc: `${SITE_URL}/about`,
    lastmod: today,
    changefreq: 'monthly',
    priority: 0.7,
  });

  urls.push({
    loc: `${SITE_URL}/contact`,
    lastmod: today,
    changefreq: 'monthly',
    priority: 0.7,
  });

  // 2. Sistemas Sinérgicos
  urls.push({
    loc: `${SITE_URL}/sistemas-sinergicos`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.8,
  });

  // 3. Productos individuales
  console.log('📦 Cargando productos...');
  const products = await loadProducts();
  
  if (products.length > 0) {
    console.log(`✅ ${products.length} productos encontrados`);
    
    products.forEach((product: any) => {
      // Generar slug desde el nombre del producto
      const slug = product.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9]+/g, '-')      // Reemplazar espacios y caracteres especiales
        .replace(/^-+|-+$/g, '');         // Eliminar guiones al inicio/final

      urls.push({
        loc: `${SITE_URL}/product/${slug}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.7,
      });
    });
  } else {
    console.warn('⚠️  No se encontraron productos para el sitemap');
  }

  // 4. Posts del blog
  console.log('📝 Cargando posts del blog...');
  const blogPosts = await loadBlogPosts();
  
  if (blogPosts.length > 0) {
    console.log(`✅ ${blogPosts.length} posts encontrados`);
    
    blogPosts.forEach((post: any) => {
      urls.push({
        loc: `${SITE_URL}/blog/${post.slug}`,
        lastmod: post.date || today,
        changefreq: 'monthly',
        priority: 0.6,
      });
    });
  } else {
    console.warn('⚠️  No se encontraron posts del blog');
  }

  // 5. Páginas de usuario (menor prioridad, requieren auth)
  const userPages = ['profile', 'orders', 'addresses', 'wishlist'];
  userPages.forEach(page => {
    urls.push({
      loc: `${SITE_URL}/${page}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.3,
    });
  });

  return urls;
}

/**
 * Función principal
 */
async function generateSitemap() {
  console.log('🗺️  Generando sitemap.xml...\n');

  try {
    // Generar URLs
    const urls = await generateSitemapUrls();
    console.log(`\n📊 Total de URLs: ${urls.length}`);

    // Generar XML
    const sitemapXML = generateSitemapXML(urls);

    // Guardar archivo
    fs.writeFileSync(OUTPUT_PATH, sitemapXML, 'utf-8');
    console.log(`✅ Sitemap generado: ${OUTPUT_PATH}`);

    // Estadísticas
    const stats = {
      total: urls.length,
      priority1: urls.filter(u => u.priority === 1.0).length,
      priority09: urls.filter(u => u.priority === 0.9).length,
      priority08: urls.filter(u => u.priority === 0.8).length,
      priority07: urls.filter(u => u.priority === 0.7).length,
      priority06: urls.filter(u => u.priority === 0.6).length,
      priority03: urls.filter(u => u.priority === 0.3).length,
    };

    console.log('\n📈 Estadísticas:');
    console.log(`  Priority 1.0 (Homepage): ${stats.priority1}`);
    console.log(`  Priority 0.9 (Store): ${stats.priority09}`);
    console.log(`  Priority 0.8 (Blog, Services): ${stats.priority08}`);
    console.log(`  Priority 0.7 (Products, About): ${stats.priority07}`);
    console.log(`  Priority 0.6 (Blog posts): ${stats.priority06}`);
    console.log(`  Priority 0.3 (User pages): ${stats.priority03}`);

    console.log('\n✨ Sitemap generado exitosamente!');
    console.log(`📍 URL: ${SITE_URL}/sitemap.xml`);
    
  } catch (error) {
    console.error('❌ Error al generar sitemap:', error);
    process.exit(1);
  }
}

// Ejecutar
generateSitemap();
