import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, slug, description, price, imageUrl, stock } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price) || 0,
        imageUrl,
        stock: Number.isFinite(Number(stock)) ? Number(stock) : 0,
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
