import type { SQL } from 'drizzle-orm';
import { gt, lt } from 'drizzle-orm';

export interface CursorPaginationParams {
  limit?: number;
  cursor?: number | string | null;
}

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: number | string | null;
  prevCursor: number | string | null;
  hasMore: boolean;
  total?: number;
}

export class PaginationBuilder<T extends Record<string, any>> {
  private readonly idField: keyof T;
  private readonly defaultLimit: number;
  private readonly maxLimit: number;

  constructor(options?: { idField?: keyof T; defaultLimit?: number; maxLimit?: number }) {
    this.idField = options?.idField ?? ('id' as keyof T);
    this.defaultLimit = options?.defaultLimit ?? 20;
    this.maxLimit = options?.maxLimit ?? 100;
  }

  normalizeLimit(limit?: number | null): number {
    if (!limit || Number.isNaN(limit)) {
      return this.defaultLimit;
    }
    return Math.min(Math.max(limit, 1), this.maxLimit);
  }

  build(params: CursorPaginationParams, rows: T[]): CursorPaginationResult<T> {
    const limit = this.normalizeLimit(params.limit);
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? (items[items.length - 1]?.[this.idField] as number | string | null) ?? null : null;

    return {
      data: items,
      nextCursor,
      prevCursor: params.cursor ?? null,
      hasMore,
    };
  }

  getCursorCondition(column: any, cursor?: number | string | null, direction: 'forward' | 'backward' = 'forward'): SQL | undefined {
    if (cursor === undefined || cursor === null) {
      return undefined;
    }

    return direction === 'forward' ? lt(column, cursor) : gt(column, cursor);
  }
}
