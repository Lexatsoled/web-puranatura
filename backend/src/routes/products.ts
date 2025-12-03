import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { createHash } from 'crypto';

const router = Router();

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

const normalizeEtagValue = (value: string): string =>
  value.replace(/^W\//i, '').trim();

const parseIfNoneMatchHeader = (header?: string | string[]): string[] => {
  if (!header) return [];
  const values = Array.isArray(header) ? header : [header];
  return values
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);
};

const buildCatalogEtag = (
  items: { id: string; updatedAt: Date }[],
  total: number,
  page: number,
  pageSize: number,
  category?: string,
  search?: string
): string => {
  const payload = {
    page,
    pageSize,
    category: category ?? null,
    search: search ?? null,
    total,
    updates: items.map((item) => item.updatedAt.toISOString()),
    ids: items.map((item) => item.id),
  };
  return `"${createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex')}"`;
};

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0).default(0),
});

router.get('/', async (req, res, next) => {
  try {
    const { page, pageSize, category, search } = querySchema.parse(req.query);
    const where = {
      ...(category
        ? { category: { contains: category, mode: 'insensitive' } }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    let items = [] as any[];
    let total = 0;
    let normalizedPage = page;
    const clampPage = (count: number) => {
      const maxPage = Math.max(1, Math.ceil(count / pageSize));
      return Math.min(page, maxPage);
    };

    try {
      total = await prisma.product.count({ where });
      normalizedPage = clampPage(total);
      items = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (normalizedPage - 1) * pageSize,
        take: pageSize,
      });
    } catch (dbErr) {
      // If DB read fails in development try to recover gracefully:
      // 1) attempt to seed the DB using the bundled seeder (dev-only)
      // 2) re-query the DB
      // 3) as a last resort load the legacy frontend data/products.ts module
      //    (keeps the frontend functional for local development)
      logger.warn(
        { err: dbErr, route: req.originalUrl },
        'Products DB read failed, trying seeding/fallback (dev)'
      );

      // Dev-only: try to seed and re-read if possible
      if (process.env.NODE_ENV !== 'production') {
        try {
          logger.info(
            'Attempting to seed products after DB read failure (dev)'
          );
          // dynamic import and cast to any to avoid ESM/CJS and typing friction in tests
          const seedModule: any = await import('../prisma/seed');
          if (typeof seedModule?.seedProducts === 'function') {
            await seedModule.seedProducts(prisma);
            logger.info('Seeding completed, re-querying products (dev)');
            const results = await Promise.all([
              prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
              }),
              prisma.product.count({ where }),
            ]);
            items = results[0];
            total = results[1];
          }
        } catch (seedErr) {
          logger.warn(
            { err: seedErr },
            'Seed attempt failed, falling back to legacy frontend data (dev)'
          );

          // Last-resort fallback -> use frontend bundled data/products.ts so UI remains useful locally
          try {
            const fallbackModule: any = await import('../data/products');
            const legacy =
              fallbackModule?.products ?? fallbackModule?.default ?? [];
            // Normalize fallback records so they are stable across requests
            const normalizedLegacy = legacy.map((p: any, idx: number) => ({
              ...p,
              // prefer explicit id/slug; otherwise build a deterministic fallback id
              id: p.id ?? p.slug ?? `legacy-${idx}`,
              // ensure a stable updatedAt so computed ETags stay consistent
              updatedAt: p.updatedAt
                ? new Date(p.updatedAt)
                : new Date('1970-01-01T00:00:00.000Z'),
            }));
            total = normalizedLegacy.length;
            const fallbackPage = clampPage(total);
            const offset = (fallbackPage - 1) * pageSize;
            items = normalizedLegacy.slice(offset, offset + pageSize);
            normalizedPage = fallbackPage;
            logger.warn(
              'Using legacy products fallback due to DB failure (dev)'
            );
          } catch (legacyErr) {
            logger.error(
              { err: legacyErr },
              'Legacy products fallback failed as well'
            );
            items = [];
            total = 0;
          }
        }
      } else {
        // In production behave conservatively and surface empty list so callers can decide
        items = [];
        total = 0;
      }
    }

    const catalogEtag = buildCatalogEtag(
      items.map((item) => ({ id: item.id, updatedAt: item.updatedAt })),
      total,
      normalizedPage,
      pageSize,
      category,
      search
    );
    const incomingEtags = parseIfNoneMatchHeader(req.headers['if-none-match']);
    const normalizedEtag = normalizeEtagValue(catalogEtag);
    const matchesIfNoneMatch = incomingEtags.some(
      (value) => normalizeEtagValue(value) === normalizedEtag
    );

    const catalogResponse = res
      .header('X-Total-Count', total.toString())
      .header('X-Page', normalizedPage.toString())
      .header('X-Page-Size', pageSize.toString())
      // indicate degraded state to help debugging in development
      .header(
        'X-Backend-Degraded',
        String(total === 0 && process.env.NODE_ENV !== 'production')
      )
      .header(
        'Cache-Control',
        'public, max-age=300, s-maxage=300, stale-while-revalidate=60'
      )
      .header('ETag', catalogEtag);

    if (matchesIfNoneMatch) {
      return catalogResponse.status(304).end();
    }

    return catalogResponse.json(items);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { name, slug, description, price, imageUrl, stock } =
      createProductSchema.parse(req.body);
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        imageUrl,
        stock,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

export default router;
