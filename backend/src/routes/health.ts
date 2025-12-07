import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    // Ping ligero a la base de datos para validar conectividad
    const [{ ok }] =
      await prisma.$queryRawUnsafe<{ ok: number }[]>('SELECT 1 as ok');
    const productCount = await prisma.product.count();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: ok === 1 ? 'up' : 'unknown',
      productCount,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
