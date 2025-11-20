import { Express } from 'express';
import authRouter from './auth';
import healthRouter from './health';
import ordersRouter from './orders';
import productsRouter from './products';

export const registerRoutes = (app: Express) => {
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
};
