import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
});

router.post('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { items } = orderSchema.parse(req.body);
    type ProductPricing = { id: string; price: number };

    const products: ProductPricing[] = await prisma.product.findMany({
      where: { id: { in: items.map((item) => item.productId) } },
      select: { id: true, price: true },
    });

    if (products.length !== items.length) {
      return res.status(400).json({
        message: 'Al menos uno de los productos no existe',
      });
    }

    const itemsWithPricing = items.map((item) => {
      const product = products.find(
        (product: ProductPricing) => product.id === item.productId
      );

      if (!product) {
        throw new Error('Producto no encontrado tras la validacion previa');
      }

      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    const total = itemsWithPricing.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        total,
        items: {
          create: itemsWithPricing,
        },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

export default router;
