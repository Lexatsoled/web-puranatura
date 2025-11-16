import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../db/client';
import { orders, orderItems } from '../../db/schema/orders';
import { validate } from '../../middleware/validate';
import { optionalAuth, requireAuth, requireRole, isAdminUser } from '../../middleware/auth';
import {
  createOrderSchema,
  orderParamSchema,
  orderListQuerySchema,
  orderStatusUpdateSchema,
  type CreateOrderInput,
  type OrderListQuery,
  type OrderStatusUpdateInput,
} from '../../types/validation';
import { sanitizeAddress, sanitizeDbString, sanitizeOptionalString } from '../../db/helpers';
import { createRateLimitConfig } from '../../config/rateLimitRules';
import { logCriticalError, logOrderCreated, logSecurityEvent } from '../../utils/logging.js';
import { OrderService, OrderNotFoundError, InvalidStatusTransitionError } from '../../services/orderService.js';

type OrderWithItems = NonNullable<Awaited<ReturnType<typeof OrderService.getOrderById>>>;

const buildTrackingInfo = (order: OrderWithItems) => {
  const createdAt = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt);
  const estimated = new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000);
  return {
    number: order.trackingNumber ?? null,
    carrier: 'Pureza Express',
    status: order.status,
    estimatedDelivery: estimated.toISOString(),
    url: order.trackingNumber ? `https://tracking.purezanaturalis.com/${order.trackingNumber}` : null,
  };
};

const toOrderV2 = (order: OrderWithItems) => {
  const { items, ...rest } = order;
  return {
    ...rest,
    lineItems: items,
    tracking: buildTrackingInfo(order),
  };
};

export async function orderRoutes(app: FastifyInstance) {
  app.post(
    '/orders',
    {
      config: {
        rateLimit: createRateLimitConfig('checkout'),
      },
      preHandler: [optionalAuth, validate(createOrderSchema)],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = request.body as CreateOrderInput;
        const calculatedTotal =
          body.summary.subtotal +
          body.summary.shipping +
          body.summary.tax -
          (body.summary.discount || 0);

        if (Math.abs(calculatedTotal - body.summary.total) > 0.01) {
          return reply.status(400).send({
            error: 'Validación fallida',
            message: 'El total calculado no coincide con el enviado',
          });
        }

        const userId =
          (request as FastifyRequest & { user?: { userId: string } }).user?.userId ?? null;
        const sanitizedAddress = sanitizeAddress(body.shippingAddress);

        const [createdOrder] = await db
          .insert(orders)
          .values({
            userId,
            shippingAddress: sanitizedAddress,
            paymentMethod: body.paymentMethod,
            orderNotes: sanitizeOptionalString(body.orderNotes ?? null),
            subtotal: body.summary.subtotal,
            shipping: body.summary.shipping,
            tax: body.summary.tax,
            discount: body.summary.discount || 0,
            total: body.summary.total,
            status: 'pending',
          })
          .returning();

        const items = body.items.map((item) => ({
          orderId: createdOrder.id,
          productId: sanitizeDbString(item.productId),
          productName: sanitizeDbString(item.productName),
          productImage: sanitizeOptionalString(item.productImage ?? null),
          variantId: sanitizeOptionalString(item.variantId ?? null),
          variantName: sanitizeOptionalString(item.variantName ?? null),
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        }));

        const insertedItems = await db.insert(orderItems).values(items).returning();
        logOrderCreated(createdOrder.id, userId ?? 'anon', body.summary.total);

        return reply.status(201).send({
          success: true,
          orderId: createdOrder.id,
          order: toOrderV2({ ...createdOrder, items: insertedItems }),
        });
      } catch (error) {
        logCriticalError(error as Error, {
          route: 'POST /orders',
          userId: (request as FastifyRequest & { user?: { userId: string } }).user?.userId ?? null,
        });
        return reply.status(500).send({
          error: 'Error interno',
          message: 'No se pudo procesar el pedido',
        });
      }
    },
  );

  app.get(
    '/orders',
    {
      preHandler: [requireAuth, validate(orderListQuerySchema, 'query')],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const query = request.query as OrderListQuery;
        const user = (request as FastifyRequest & { user: { userId: string; email: string } }).user;
        const admin = isAdminUser(user.email);
        const result = await OrderService.listOrders({
          userId: String(user.userId),
          includeAll: admin,
          filters: {
            ...query,
            userId: admin ? query.userId : undefined,
          },
        });
        return reply.send({
          ...result,
          data: result.data.map((order) => toOrderV2(order)),
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          error: 'Error interno',
          message: 'No se pudieron obtener las ordenes',
        });
      }
    },
  );

  app.get(
    '/orders/:orderId',
    {
      preHandler: [requireAuth, validate(orderParamSchema, 'params')],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { orderId } = request.params as { orderId: string };
        const user = (request as FastifyRequest & { user: { userId: string; email: string } }).user;
        const admin = isAdminUser(user.email);

        const order = await OrderService.getOrderById(orderId);
        if (!order || (!admin && order.userId !== String(user.userId))) {
          return reply.status(404).send({
            error: 'No encontrado',
            message: 'Orden no existe',
          });
        }

        return reply.send({ order: toOrderV2(order) });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          error: 'Error interno',
          message: 'No se pudo obtener la orden',
        });
      }
    },
  );

  app.patch(
    '/orders/:orderId',
    {
      preHandler: [
        requireRole('admin'),
        validate(orderParamSchema, 'params'),
        validate(orderStatusUpdateSchema),
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { orderId } = request.params as { orderId: string };
      const body = request.body as OrderStatusUpdateInput;
      try {
        const order = await OrderService.updateOrderStatus(orderId, {
          status: body.status,
          trackingNumber: body.trackingNumber,
          adminNotes: body.adminNotes,
        });
        logSecurityEvent('order_status_updated', {
          orderId,
          status: body.status,
          actor: request.user?.email,
        });
        return reply.send({ order: toOrderV2(order) });
      } catch (error) {
        if (error instanceof OrderNotFoundError) {
          return reply.status(404).send({
            error: 'No encontrado',
            message: 'La orden no existe',
          });
        }
        if (error instanceof InvalidStatusTransitionError) {
          return reply.status(400).send({
            error: 'Transicion invalida',
            message: error.message,
          });
        }
        app.log.error(error);
        return reply.status(500).send({
          error: 'Error interno',
          message: 'No se pudo actualizar la orden',
        });
      }
    },
  );

  app.get(
    '/orders/stats',
    {
      preHandler: [requireRole('admin')],
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const stats = await OrderService.getStats();
        return reply.send(stats);
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          error: 'Error interno',
          message: 'No se pudieron obtener las estadisticas',
        });
      }
    },
  );
}
