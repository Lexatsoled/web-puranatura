import { and, desc, eq, gte, inArray, lt, lte, sql } from 'drizzle-orm';
import { db } from '../db/client.js';
import { orders, orderItems, type Order, type OrderItem, orderStatusEnum } from '../db/schema/orders.js';
import type { OrderStatus } from '../db/schema/orders.js';
import { logger } from '../config/logger.js';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

export type OrderListFilters = {
  status?: OrderStatus;
  search?: string;
  from?: Date;
  to?: Date;
  userId?: string;
  cursor?: string;
  limit?: number;
};

export interface OrderListResult {
  data: Array<Order & { items: OrderItem[] }>;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Array<{ status: OrderStatus; count: number }>;
  recentOrders: Array<{ id: string; total: number; status: OrderStatus; createdAt: Date }>;
}

const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export class OrderNotFoundError extends Error {
  constructor(message = 'Order not found') {
    super(message);
    this.name = 'OrderNotFoundError';
  }
}

export class InvalidStatusTransitionError extends Error {
  constructor(message = 'Invalid status transition') {
    super(message);
    this.name = 'InvalidStatusTransitionError';
  }
}

const normalizeLimit = (value?: number) => {
  if (!value) return DEFAULT_LIMIT;
  return Math.min(Math.max(value, 1), MAX_LIMIT);
};

const applySearchCondition = (search: string) => {
  const query = `%${search.toLowerCase()}%`;
  return sql`LOWER(${orders.id}) LIKE ${query}
    OR LOWER(${orders.orderNotes} || '') LIKE ${query}
    OR LOWER(${orders.shippingAddress} || '') LIKE ${query}`;
};

const parseShippingAddress = (value: unknown) => {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
};

const serializeOrders = (
  list: Order[],
  itemsMap: Map<string, OrderItem[]>,
): Array<Order & { items: OrderItem[] }> => {
  return list.map((order) => ({
    ...order,
    shippingAddress: parseShippingAddress(order.shippingAddress),
    items: itemsMap.get(order.id) ?? [],
  }));
};

type OrderJoinRow = {
  order: Order;
  item: OrderItem | null;
};

const buildOrderFromJoin = (rows: OrderJoinRow[]): (Order & { items: OrderItem[] }) | null => {
  if (!rows.length) {
    return null;
  }

  const baseOrder = rows[0].order;
  const items = rows
    .map((row) => row.item)
    .filter((item): item is OrderItem => Boolean(item));

  return {
    ...baseOrder,
    shippingAddress: parseShippingAddress(baseOrder.shippingAddress),
    items,
  };
};

const fetchOrderWithItems = async (orderId: string) => {
  const rows = await db
    .select({
      order: orders,
      item: orderItems,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(eq(orders.id, orderId));

  return buildOrderFromJoin(rows);
};

async function fetchCursorCreatedAt(cursor: string | undefined) {
  if (!cursor) return undefined;
  const record = await db.select({ createdAt: orders.createdAt }).from(orders).where(eq(orders.id, cursor)).get();
  return record?.createdAt;
}

export const OrderService = {
  async listOrders(params: {
    userId: string;
    includeAll: boolean;
    filters: OrderListFilters;
  }): Promise<OrderListResult> {
    const limit = normalizeLimit(params.filters.limit);
    const conditions = [];

    if (!params.includeAll) {
      conditions.push(eq(orders.userId, params.userId));
    } else if (params.filters.userId) {
      conditions.push(eq(orders.userId, params.filters.userId));
    }

    if (params.filters.status) {
      conditions.push(eq(orders.status, params.filters.status));
    }

    if (params.filters.from) {
      conditions.push(gte(orders.createdAt, params.filters.from));
    }

    if (params.filters.to) {
      conditions.push(lte(orders.createdAt, params.filters.to));
    }

    if (params.filters.search) {
      conditions.push(applySearchCondition(params.filters.search));
    }

    const cursorDate = await fetchCursorCreatedAt(params.filters.cursor);
    if (cursorDate) {
      conditions.push(lt(orders.createdAt, cursorDate));
    }

    const queryBase = db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt), desc(orders.id))
      .limit(limit + 1);

    const rows = conditions.length
      ? await queryBase.where(and(...conditions))
      : await queryBase;
    const hasMore = rows.length > limit;
    const trimmed = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? trimmed[trimmed.length - 1].id : null;

    const orderIds = trimmed.map((order) => order.id);
    const items = orderIds.length
      ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
      : [];
    const itemsMap = new Map<string, OrderItem[]>();
    items.forEach((item) => {
      const bucket = itemsMap.get(item.orderId) ?? [];
      bucket.push(item);
      itemsMap.set(item.orderId, bucket);
    });

    return {
      data: serializeOrders(trimmed, itemsMap),
      nextCursor,
      hasMore,
    };
  },

  async getOrderById(orderId: string): Promise<(Order & { items: OrderItem[] }) | null> {
    return fetchOrderWithItems(orderId);
  },

  async updateOrderStatus(
    orderId: string,
    input: { status: OrderStatus; trackingNumber?: string | null; adminNotes?: string | null },
  ): Promise<Order & { items: OrderItem[] }> {
    const existing = await db.select().from(orders).where(eq(orders.id, orderId)).get();
    if (!existing) {
      throw new OrderNotFoundError();
    }

    if (!statusTransitions[existing.status as OrderStatus]?.includes(input.status)) {
      throw new InvalidStatusTransitionError(`Transition from ${existing.status} to ${input.status} is not allowed`);
    }

    await db
      .update(orders)
      .set({
        status: input.status,
        trackingNumber: input.trackingNumber ?? existing.trackingNumber,
        adminNotes: input.adminNotes ?? existing.adminNotes,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    const updatedOrder = await fetchOrderWithItems(orderId);
    if (!updatedOrder) {
      throw new OrderNotFoundError();
    }
    return updatedOrder;
  },

  async getStats(): Promise<OrderStats> {
    const totals = await db
      .select({
        totalOrders: sql<number>`COUNT(*)`,
        totalRevenue: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
      })
      .from(orders)
      .get();

    const byStatusRaw = await db
      .select({
        status: orders.status,
        count: sql<number>`COUNT(*)`,
      })
      .from(orders)
      .groupBy(orders.status);

    const recent = await db
      .select({
        id: orders.id,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    return {
      totalOrders: totals?.totalOrders ?? 0,
      totalRevenue: totals?.totalRevenue ?? 0,
      ordersByStatus: orderStatusEnum.map((status) => ({
        status,
        count: byStatusRaw.find((entry) => entry.status === status)?.count ?? 0,
      })),
      recentOrders: recent,
    };
  },
};
