import { app, closeApp } from './app';
import { env } from './config/env';
import { prisma } from './prisma';

// Arranque con reintentos si el puerto está ocupado (útil en dev).
const startPort = env.port;
const maxAttempts = 10; // probar hasta startPort + maxAttempts - 1

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
      try {
        const c = await prisma.product.count();
        // eslint-disable-next-line no-console
        console.log(`[startup] DB product count: ${c}`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[startup] DB check failed:', err && (err as any).message ? (err as any).message : err);
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
