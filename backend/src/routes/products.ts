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

    try {
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
    } catch (dbErr) {
      // If DB is missing/corrupt in dev, avoid returning 500 to frontend UI —
      // return an empty catalog and flag degraded state so UI can fallback.
      logger.warn({ err: dbErr, route: req.originalUrl }, 'Products DB read failed, returning empty list');
      items = [];
      total = 0;
    }

    const catalogEtag = buildCatalogEtag(
      items.map((item) => ({ id: item.id, updatedAt: item.updatedAt })),
      total,
      page,
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
      .header('X-Page', page.toString())
      .header('X-Page-Size', pageSize.toString())
  // indicate degraded state to help debugging in development
  .header('X-Backend-Degraded', String(total === 0 && process.env.NODE_ENV !== 'production'))
      .header('Cache-Control', 'public, max-age=300')
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
