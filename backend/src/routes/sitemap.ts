import { FastifyPluginAsync } from 'fastify';

interface Product {
  id: number;
  updated_at?: string;
}

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  priority: number;
  changefreq: string;
}

export const sitemapRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/sitemap.xml', async (request, reply) => {
    try {
      // Obtener productos de la base de datos
      const products: Product[] = [];
      
      const categories = ['vitaminas', 'minerales', 'suplementos', 'hierbas', 'aceites'];

      const urls: SitemapUrl[] = [
        // Páginas estáticas
        { loc: '/', priority: 1.0, changefreq: 'daily' },
        { loc: '/products', priority: 0.9, changefreq: 'daily' },
        { loc: '/servicios', priority: 0.8, changefreq: 'weekly' },
        { loc: '/tienda', priority: 0.9, changefreq: 'daily' },
        { loc: '/about', priority: 0.5, changefreq: 'monthly' },
        { loc: '/contact', priority: 0.5, changefreq: 'monthly' },
        
        // Categorías
        ...categories.map(cat => ({
          loc: `/products?category=${cat}`,
          priority: 0.8,
          changefreq: 'daily',
        })),
        
        // Productos
        ...products.map((p) => ({
          loc: `/products/${p.id}`,
          lastmod: p.updated_at,
          priority: 0.7,
          changefreq: 'weekly',
        })),
      ];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>https://purezanaturalis.com${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      reply.type('application/xml').send(xml);
    } catch (error) {
      fastify.log.error(error, 'Error generating sitemap');
      reply.code(500).send({ error: 'Failed to generate sitemap' });
    }
  });
};
