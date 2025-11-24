import { app, closeApp } from './app';
import { env } from './config/env';
import { prisma } from './prisma';

// Start server with simple retry logic if the default port is busy.
// This helps local development when a previous process didn't exit or
// the dev environment has another service using the port.
const startPort = env.port;
const maxAttempts = 10; // try up to startPort + maxAttempts

const startServer = (port: number) => {
  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API de PuraNatura lista en http://localhost:${port}`);
  });

  server.on('error', (err: any) => {
    if (err && err.code === 'EADDRINUSE') {
      // Rethrow and let caller decide to retry
      throw err;
    }

    // For all other errors, just log and rethrow so nodemon shows the trace
    // eslint-disable-next-line no-console
    console.error('Error al arrancar el servidor', err);
    throw err;
  });

  return server;
};

let server: ReturnType<typeof app.listen> | undefined;

// try sequential ports until success or until max attempts reached
for (let attempt = 0; attempt < maxAttempts; attempt++) {
  const portToTry = startPort + attempt;
  try {
    server = startServer(portToTry);
    // successful start -> break out
    break;
  } catch (err: any) {
    if (err && err.code === 'EADDRINUSE') {
      // eslint-disable-next-line no-console
      console.warn(`Puerto ${portToTry} ocupado. Intentando puerto ${portToTry + 1}...`);
      // if this was the last attempt, print helpful note and exit
      if (attempt === maxAttempts - 1) {
        // eslint-disable-next-line no-console
        console.error(
          `No se pudo iniciar el servidor. Todos los puertos desde ${startPort} a ${startPort + maxAttempts - 1} están ocupados.`
        );
        // Rethrow so nodemon / process will show the error too
        throw err;
      }
      // otherwise try next
      continue;
    }

    // unknown error - rethrow
    throw err;
  }
}

const gracefulShutdown = async () => {
  // close the HTTP server so the port is freed
  if (server && typeof server.close === 'function') {
    // eslint-disable-next-line no-console
    console.log('Cerrando servidor HTTP...');
    try {
      await new Promise<void>((resolve, reject) => {
        server!.close((closeErr: any) => (closeErr ? reject(closeErr) : resolve()));
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
