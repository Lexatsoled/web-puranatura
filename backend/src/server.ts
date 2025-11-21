import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { registerRoutes } from './routes';
import { env } from './config/env';
import { prisma } from './prisma';

const app = express();

app.use(cors({ origin: env.allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

registerRoutes(app);

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('[API error]', error);
    res
      .status(500)
      .json({ message: 'Error interno en el backend', details: error.message });
  }
);

const port = env.port;
app.listen(port, () => {
  console.log(`API de PuraNatura lista en http://localhost:${port}`);
});

const gracefulShutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
