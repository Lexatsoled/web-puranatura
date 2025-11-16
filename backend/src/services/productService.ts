import { and, asc, desc, eq, lt, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { createHash } from 'crypto';
import { db } from '../db/client.js';
import {
  products as productsTable,
  type Product as ProductRecord,
  type ProductComponent,
  type ProductFaq,
  type ScientificReference,
} from '../db/schema';
import type {
  ProductBase,
  ProductFilters,
  ProductListResult,
} from '../types/product';
import { PaginationBuilder } from '../utils/pagination.js';
import { QueryBuilder } from '../utils/queryBuilder.js';
import { cacheService } from './cacheService.js';
import { config } from '../config/index.js';
import { getConnectionPool } from '../db/index.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const paginator = new PaginationBuilder<ProductBase>({ idField: 'id', defaultLimit: DEFAULT_LIMIT, maxLimit: MAX_LIMIT });
const PRODUCTS_CACHE_TTL = config.CACHE_TTL_PRODUCTS ?? 3600;

const buildListCacheKey = (filters: unknown) =>
  `products:list:${createHash('sha1').update(JSON.stringify(filters)).digest('hex')}`;

const buildProductCacheKey = (id: number) => `product:${id}`;

const SELECT_PRODUCT_BY_ID_SQL = `
  SELECT *
  FROM products
  WHERE id = ?
  LIMIT 1
`;

const SELECT_PRODUCTS_BY_CATEGORY_SQL = `
  SELECT *
  FROM products
  WHERE category = ?
  ORDER BY is_featured DESC, name ASC
  LIMIT ?
`;

const ensureArray = <T>(value: unknown, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (Array.isArray(value)) {
    return value as T;
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return (Array.isArray(parsed) ? parsed : fallback) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const ensureObjectArray = <T>(value: unknown, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (Array.isArray(value)) {
    return value as T;
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return (Array.isArray(parsed) ? parsed : fallback) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const ensureString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  return String(value);
};

const toBoolean = (value: unknown): boolean =>
  typeof value === 'boolean' ? value : Boolean(value);

const mapProductRecord = (record: ProductRecord): ProductBase => ({
  id: record.id,
  name: record.name,
  description: ensureString(record.description),
  price: record.price,
  compareAtPrice:
    typeof record.compare_at_price === 'number'
      ? record.compare_at_price
      : record.compare_at_price !== null && record.compare_at_price !== undefined
      ? Number(record.compare_at_price)
      : null,
  stock: record.stock ?? 0,
  category: record.category,
  subcategory: ensureString(record.subcategory),
  categories: ensureArray<string[]>(record.categories, []),
  sku: ensureString(record.sku),
  isFeatured: toBoolean(record.is_featured),
  images: ensureArray<string[]>(record.images, []),
  benefits: ensureArray<string[]>(record.benefits, []),
  benefitsDescription: ensureArray<string[]>(record.benefits_description, []),
  ingredients: ensureArray<string[]>(record.ingredients, []),
  usage: ensureString(record.usage),
  dosage: ensureString(record.dosage),
  administrationMethod: ensureString(record.administration_method),
  warnings: ensureString(record.warnings),
  rating:
    typeof record.rating === 'number' ? record.rating : Number(record.rating ?? 0),
  reviewCount:
    typeof record.reviews_count === 'number'
      ? record.reviews_count
      : Number(record.reviews_count ?? 0),
  detailedDescription: ensureString(record.detailed_description),
  mechanismOfAction: ensureString(record.mechanism_of_action),
  healthIssues: ensureArray<string[]>(record.health_issues, []),
  components: ensureObjectArray<ProductComponent[]>(record.components, []),
  faqs: ensureObjectArray<ProductFaq[]>(record.faqs, []),
  scientificReferences: ensureObjectArray<ScientificReference[]>(
    record.scientific_references,
    []
  ),
  tags: ensureArray<string[]>(record.tags, []),
  priceNote: ensureString(record.price_note),
  createdAt: record.created_at,
});

const buildSearchCondition = (term?: string): SQL | undefined => {
  if (!term) {
    return undefined;
  }

  const normalized = `%${term.trim().toLowerCase()}%`;
  return sql`
    (
      lower(${productsTable.name}) LIKE ${normalized}
      OR lower(${productsTable.description}) LIKE ${normalized}
      OR EXISTS (
        SELECT 1 FROM json_each(${productsTable.tags})
        WHERE lower(json_each.value) LIKE ${normalized}
      )
      OR EXISTS (
        SELECT 1 FROM json_each(${productsTable.categories})
        WHERE lower(json_each.value) LIKE ${normalized}
      )
    )
  `;
};

const buildWhereClause = (filters: ProductFilters): SQL<unknown> | undefined => {
  const qb = new QueryBuilder();

  if (filters.category) {
    qb.where(productsTable.category, 'eq', filters.category);
  }

  if (filters.featured) {
    qb.where(productsTable.is_featured, 'eq', true);
  }

  if (typeof filters.priceMin === 'number') {
    qb.where(productsTable.price, 'gte', filters.priceMin);
  }

  if (typeof filters.priceMax === 'number') {
    qb.where(productsTable.price, 'lte', filters.priceMax);
  }

  if (filters.inStock) {
    qb.where(productsTable.stock, 'gt', 0);
  }

  const searchCondition = buildSearchCondition(filters.search);
  qb.whereRaw(searchCondition);

  return qb.build();
};

const normalizeCursor = (cursor?: number | string | null): number | null => {
  if (cursor === undefined || cursor === null) {
    return null;
  }
  const value = typeof cursor === 'string' ? Number.parseInt(cursor, 10) : Number(cursor);
  return Number.isNaN(value) ? null : value;
};

export const productService = {
  async getAllProducts(filters: ProductFilters = {}): Promise<ProductListResult> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(Math.max(1, filters.limit ?? DEFAULT_LIMIT), MAX_LIMIT);
    const cursor = normalizeCursor(filters.cursor);
    const sortBy = filters.sortBy ?? 'createdAt';
    const sortDir = filters.sortDir ?? 'desc';

    const cacheKey = buildListCacheKey({
      ...filters,
      page,
      limit,
      cursor,
      sortBy,
      sortDir,
    });

    return cacheService.wrap(cacheKey, async () => {
      const whereClause = buildWhereClause(filters);
      const cursorCondition = cursor !== null ? lt(productsTable.id, cursor) : undefined;

      const sortColumns = {
        price: productsTable.price,
        name: productsTable.name,
        createdAt: productsTable.created_at,
      } as const;

      const sortColumn = sortColumns[sortBy] ?? productsTable.created_at;
      const sortDirection = sortDir === 'asc' ? asc(sortColumn) : desc(sortColumn);

      const conditions: SQL[] = [];
      if (whereClause) conditions.push(whereClause);
      if (cursorCondition) conditions.push(cursorCondition);

      let query = db.select().from(productsTable);
      if (conditions.length) {
        query = query.where(and(...conditions)) as typeof query;
      }

      const rows = query.orderBy(sortDirection, desc(productsTable.id)).limit(limit + 1).all();
      const mapped = rows.map(mapProductRecord);
      const pagination = paginator.build({ limit, cursor }, mapped);

      let totalQuery = db.select({ value: sql<number>`count(*)` }).from(productsTable);
      if (whereClause) {
        totalQuery = totalQuery.where(whereClause) as typeof totalQuery;
      }

      const totalRow = totalQuery.get();
      const total = totalRow?.value ?? 0;
      const totalPages = Math.max(1, Math.ceil(total / limit) || 1);

      return {
        products: pagination.data,
        total,
        page,
        limit,
        totalPages,
        nextCursor: pagination.nextCursor,
        prevCursor: pagination.prevCursor,
        hasMore: pagination.hasMore,
      };
    }, PRODUCTS_CACHE_TTL);
  },

  async getProductById(id: string): Promise<ProductBase | null> {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      return null;
    }

    // SOLUCIÓN TEMPORAL: Usar conexión directa en lugar del pool
    const Database = (await import('better-sqlite3')).default;
    const directDb = new Database('./database.sqlite');
    const record = directDb.prepare(SELECT_PRODUCT_BY_ID_SQL).get(numericId) as ProductRecord | undefined;
    directDb.close();

    if (!record) {
      return null;
    }

    return mapProductRecord(record);
  },

  async getProductsByCategory(category: string, limit = 20): Promise<ProductBase[]> {
    const normalizedLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
    const rows = await getConnectionPool().withConnection((connection) => {
      return connection
        .prepare(SELECT_PRODUCTS_BY_CATEGORY_SQL)
        .all(category, normalizedLimit) as ProductRecord[];
    });

    return rows.map(mapProductRecord);
  },

  getFeaturedProducts(limit = 8): ProductBase[] {
    const rows = db
      .select()
      .from(productsTable)
      .where(eq(productsTable.is_featured, true))
      .orderBy(desc(productsTable.rating), asc(productsTable.name))
      .limit(limit)
      .all();

    return rows.map(mapProductRecord);
  },

  searchProducts(query: string, limit = 20): ProductBase[] {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    const normalized = `%${trimmed.toLowerCase()}%`;
    const rows = db
      .select()
      .from(productsTable)
      .where(
        sql`
          lower(${productsTable.name}) LIKE ${normalized}
          OR lower(${productsTable.description}) LIKE ${normalized}
          OR EXISTS (
            SELECT 1 FROM json_each(${productsTable.tags})
            WHERE lower(json_each.value) LIKE ${normalized}
          )
          OR EXISTS (
            SELECT 1 FROM json_each(${productsTable.categories})
            WHERE lower(json_each.value) LIKE ${normalized}
          )
        `
      )
      .orderBy(desc(productsTable.rating), asc(productsTable.name))
      .limit(limit)
      .all();

    return rows.map(mapProductRecord);
  },

  searchBySystem(
    systemId: string,
    filters: ProductFilters = {}
  ): ProductListResult {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(Math.max(1, filters.limit ?? DEFAULT_LIMIT), MAX_LIMIT);
    const offset = (page - 1) * limit;

    const normalizedSystem = systemId.toLowerCase();
    const categoryPattern = `sistema-${systemId}`;
    const searchPattern = `%${normalizedSystem}%`;

    // Construir condiciones de búsqueda flexible
    const systemClause = sql`
      (
        lower(${productsTable.category}) = ${categoryPattern}
        OR EXISTS (
          SELECT 1 FROM json_each(${productsTable.tags})
          WHERE lower(json_each.value) LIKE ${searchPattern}
        )
        OR EXISTS (
          SELECT 1 FROM json_each(${productsTable.categories})
          WHERE lower(json_each.value) LIKE ${searchPattern}
        )
        OR lower(${productsTable.name}) LIKE ${searchPattern}
        OR lower(${productsTable.description}) LIKE ${searchPattern}
      )
    `;

    // Agregar filtros adicionales si existen
    const additionalClauses: SQL<unknown>[] = [systemClause];

    if (filters.featured) {
      additionalClauses.push(eq(productsTable.is_featured, true));
    }

    if (filters.search) {
      const searchNormalized = `%${filters.search.trim().toLowerCase()}%`;
      additionalClauses.push(
        sql`
          (
            lower(${productsTable.name}) LIKE ${searchNormalized}
            OR lower(${productsTable.description}) LIKE ${searchNormalized}
          )
        `
      );
    }

    const whereClause = and(...additionalClauses);

    // Contar total
    const totalRow = db
      .select({ value: sql<number>`count(*)` })
      .from(productsTable)
      .where(whereClause)
      .get();

    const total = totalRow?.value ?? 0;

    // Obtener productos
    const rows = db
      .select()
      .from(productsTable)
      .where(whereClause)
      .orderBy(desc(productsTable.is_featured), asc(productsTable.name))
      .limit(limit)
      .offset(offset)
      .all();

    const products = rows.map(mapProductRecord);
    const totalPages = Math.max(1, Math.ceil(total / limit) || 1);

    return {
      products,
      total,
      page,
      limit,
      totalPages,
      nextCursor: null,
      prevCursor: null,
      hasMore: false,
    };
  },
};

export type ProductService = typeof productService;

export async function invalidateProductCache(productId?: number | string) {
  const tasks: Array<Promise<void>> = [
    cacheService.deletePattern('products:list:*'),
    cacheService.deletePattern('search:results:*'),
    cacheService.deletePattern('search:suggest:*'),
  ];
  if (productId !== undefined) {
    const numericId = typeof productId === 'string' ? Number(productId) : productId;
    if (!Number.isNaN(numericId)) {
      tasks.push(cacheService.delete(buildProductCacheKey(Number(numericId))));
    }
  }
  await Promise.all(tasks);
}
