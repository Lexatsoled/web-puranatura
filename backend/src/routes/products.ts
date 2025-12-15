import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { createHash } from 'crypto';
import { CatalogBreaker } from '../services/catalogBreaker';
import { env } from '../config/env';
import { getOrSetCache } from '../utils/cache';

const breakerEnabled = env.breakerEnabled;
const breaker = breakerEnabled
  ? new CatalogBreaker({
      failureThreshold: Number(process.env.BREAKER_THRESHOLD ?? 5),
      windowMs: Number(process.env.BREAKER_WINDOW_MS ?? 30_000),
      openTimeoutMs: Number(process.env.BREAKER_OPEN_TIMEOUT ?? 60_000),
      halfOpenProbes: Number(process.env.BREAKER_HALF_OPEN_PROBES ?? 2),
    })
  : null;

const router = Router();

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(100),
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
  items: { id: string; updatedAt: Date | string }[],
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
    updates: items.map((item) => new Date(item.updatedAt).toISOString()),
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
  if (breaker && breaker.shouldShortCircuit()) {
    return res
      .status(503)
      .setHeader('X-Backend-Degraded', 'true')
      .setHeader('Retry-After', '30')
      .json({
        code: 'CATALOG_DEGRADED',
        message: 'Catálogo temporalmente no disponible',
      });
  }
  try {
    const { page, pageSize, category, search } = querySchema.parse(req.query);
    const where = {
      ...(category
        ? {
            category: {
              contains: category,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive' as Prisma.QueryMode,
                },
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive' as Prisma.QueryMode,
                },
              },
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

      const cacheKey = `products:list:${JSON.stringify({ where, orderBy: { createdAt: 'desc' }, skip: (normalizedPage - 1) * pageSize, take: pageSize })}`;

      items = await getOrSetCache(
        cacheKey,
        async () => {
          return prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (normalizedPage - 1) * pageSize,
            take: pageSize,
          });
        },
        60
      ); // 60 seconds cache

      breaker?.recordSuccess();
    } catch (dbErr) {
      breaker?.recordFailure();
      logger.warn('Products DB read failed', {
        err: dbErr,
        route: req.originalUrl,
      });

      return res.status(503).setHeader('X-Backend-Degraded', 'true').json({
        code: 'CATALOG_DEGRADED',
        message: 'Catálogo temporalmente no disponible',
      });
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

    const response = catalogResponse.json(items);
    breaker?.recordSuccess();
    return response;
  } catch (error) {
    breaker?.recordFailure();
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

router.get('/:id/reviews', async (req, res, next) => {
  try {
    const productId = req.params.id;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
      prisma.review.count({ where: { productId } }),
    ]);

    res.json({
      data: reviews,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
