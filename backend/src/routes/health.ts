import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const productCount = await prisma.product.count();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      productCount,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
