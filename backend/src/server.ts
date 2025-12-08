import { app, closeApp } from './app';
import { env } from './config/env';
import { prisma } from './prisma';
import { execSync } from 'child_process';
import { ensureSmokeUser, seedProducts } from './prisma/seed';

// Arranque con reintentos si el puerto está ocupado (útil en dev).
const startPort = env.port;
const maxAttempts = 10; // probar hasta startPort + maxAttempts - 1

console.log('[env] rate limits', {
  globalMax: env.rateLimitMax,
  authMax: env.authRateLimitMax,
  analyticsMax: env.analyticsRateLimitMax,
});

// Security Check: Fail if running built code with default secrets
if (
  process.env.NODE_ENV !== 'production' &&
  (env.jwtSecret === 'dev_jwt_secret_change_me' ||
    env.jwtRefreshSecret === 'dev_jwt_refresh_secret_change_me')
) {
  // Heuristic: If we are running from a 'dist' folder or 'server.js' (compiled),
  // we are likely in a deployment context but forgot to set NODE_ENV=production.
  const isCompiled = __dirname.includes('dist') || __filename.endsWith('.js');
  if (isCompiled) {
    console.error(
      'FATAL: Intentando ejecutar código compilado (dist) con secretos por defecto (NODE_ENV != production).'
    );
    console.error(
      'Por seguridad, el servidor no iniciará. Configura NODE_ENV=production y define JWT_SECRET reales.'
    );
    process.exit(1);
  } else {
    console.warn(
      'ADVERTENCIA: Ejecutando servidor con secretos de desarrollo. NO USAR EN PRODUCCIÓN.'
    );
  }
}

const startServer = (port: number) => {
  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API de PuraNatura lista en http://localhost:${port}`);
  });

  server.on('error', (err: any) => {
    if (err && err.code === 'EADDRINUSE') {
      // Rethrow para que el caller decida si reintenta
      throw err;
    }
    // Otros errores: log y relanzar
    // eslint-disable-next-line no-console
    console.error('Error al arrancar el servidor', err);
    throw err;
  });

  return server;
};

let server: ReturnType<typeof app.listen> | undefined;

// Intenta puertos secuenciales hasta que funcione o se agoten los intentos.
for (let attempt = 0; attempt < maxAttempts; attempt++) {
  const portToTry = startPort + attempt;
  try {
    server = startServer(portToTry);
    // Quick DB sanity check after server starts — helps surface problems
    (async () => {
      const safeEnsureSmoke = async () => {
        try {
          await ensureSmokeUser(prisma);
        } catch (seedErr) {
          // eslint-disable-next-line no-console
          console.warn(
            '[startup] ensureSmokeUser failed:',
            seedErr && (seedErr as any).message
              ? (seedErr as any).message
              : seedErr
          );
        }
      };

      try {
        const c = await prisma.product.count();
        // eslint-disable-next-line no-console
        console.log(`[startup] DB product count: ${c}`);
        // If DB is empty in non-production, seed it automatically to help
        // local development and avoid the front-end falling back to legacy
        // hardcoded fixtures.
        if (c === 0 && env.nodeEnv !== 'production') {
          // eslint-disable-next-line no-console
          console.log(
            '[startup] DB empty – running dev seed to populate sample products.'
          );
          try {
            await seedProducts(prisma);
            const newCount = await prisma.product.count();
            // eslint-disable-next-line no-console
            console.log(`[startup] Seed complete – product count: ${newCount}`);
          } catch (seedErr) {
            // eslint-disable-next-line no-console
            console.warn(
              '[startup] Seed failed:',
              seedErr && (seedErr as any).message
                ? (seedErr as any).message
                : seedErr
            );
          }
        }
        await safeEnsureSmoke();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          '[startup] DB check failed:',
          err && (err as any).message ? (err as any).message : err
        );

        // In development, try to auto-apply migrations (prisma migrate deploy)
        // then re-run seed. This helps new contributors avoid manual steps.
        if (env.nodeEnv !== 'production') {
          try {
            // eslint-disable-next-line no-console
            console.log(
              '[startup] Attempting to apply migrations automatically (dev).'
            );
            execSync(
              'npx prisma migrate deploy --schema=prisma/schema.prisma',
              {
                stdio: 'inherit',
              }
            );
            // After migrations, try seeding again
            try {
              // eslint-disable-next-line no-console
              console.log('[startup] Running seed after migrate (dev).');
              await seedProducts(prisma);
              await safeEnsureSmoke();
            } catch (seedErr) {
              // eslint-disable-next-line no-console
              console.warn(
                '[startup] Seed after migrate failed:',
                seedErr && (seedErr as any).message
                  ? (seedErr as any).message
                  : seedErr
              );
            }
          } catch (mErr) {
            // eslint-disable-next-line no-console
            console.warn(
              '[startup] Auto-migrate failed (dev):',
              mErr && (mErr as any).message ? (mErr as any).message : mErr
            );
          }
        }
      }
    })();
    break; // Éxito, salir del bucle.
  } catch (err: any) {
    if (err && err.code === 'EADDRINUSE') {
      // eslint-disable-next-line no-console
      console.warn(
        `Puerto ${portToTry} ocupado. Intentando puerto ${portToTry + 1}...`
      );
      if (attempt === maxAttempts - 1) {
        // eslint-disable-next-line no-console
        console.error(
          `No se pudo iniciar el servidor. Puertos ${startPort}-${startPort + maxAttempts - 1} ocupados.`
        );
        throw err;
      }
      continue;
    }
    // Error desconocido -> relanzar.
    throw err;
  }
}

const gracefulShutdown = async () => {
  if (server && typeof server.close === 'function') {
    // eslint-disable-next-line no-console
    console.log('Cerrando servidor HTTP...');
    try {
      await new Promise<void>((resolve, reject) => {
        server!.close((closeErr: any) =>
          closeErr ? reject(closeErr) : resolve()
        );
      });
    } catch (closeErr) {
      // eslint-disable-next-line no-console
      console.warn('Error cerrando servidor HTTP:', closeErr);
    }
  }

  await prisma.$disconnect();
  await closeApp();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
