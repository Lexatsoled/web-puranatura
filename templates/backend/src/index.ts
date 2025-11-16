import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { config } from './config';

// TODO: Crear instancia de Fastify con logger
const app = Fastify({
  logger: config.NODE_ENV === 'development' ? {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  } : true
});

// TODO: Registrar plugin Helmet (seguridad de headers)
await app.register(helmet, {
  contentSecurityPolicy: config.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  } : false
});

// TODO: Registrar plugin CORS
await app.register(cors, {
  origin: config.ALLOWED_ORIGINS.split(','),
  credentials: true
});

// TODO: Registrar plugin de cookies
await app.register(cookie, {
  secret: config.JWT_SECRET,
  parseOptions: {}
});

// TODO: Registrar rate limiting
await app.register(rateLimit, {
  max: config.RATE_LIMIT_MAX,
  timeWindow: config.RATE_LIMIT_WINDOW
});

// TODO: Health check endpoint
app.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  };
});

// TODO: Registrar rutas (descomentar cuando estén implementadas)
// import { authRoutes } from './routes/auth';
// import { productRoutes } from './routes/products';
// import { cartRoutes } from './routes/cart';
// import { orderRoutes } from './routes/orders';

// await app.register(authRoutes, { prefix: '/api/auth' });
// await app.register(productRoutes, { prefix: '/api/products' });
// await app.register(cartRoutes, { prefix: '/api/cart' });
// await app.register(orderRoutes, { prefix: '/api/orders' });

// TODO: Error handler global
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  
  // No exponer detalles de error en producción
  const isDev = config.NODE_ENV === 'development';
  
  reply.status(error.statusCode || 500).send({
    error: isDev ? error.message : 'Error interno del servidor',
    ...(isDev && { stack: error.stack })
  });
});

// TODO: Handler para rutas no encontradas
app.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    error: 'Ruta no encontrada',
    path: request.url
  });
});

// TODO: Arrancar servidor
const start = async () => {
  try {
    await app.listen({
      port: config.PORT,
      host: '0.0.0.0'
    });
    console.log(`✅ Servidor corriendo en http://localhost:${config.PORT}`);
    console.log(`📝 Documentación: http://localhost:${config.PORT}/health`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
