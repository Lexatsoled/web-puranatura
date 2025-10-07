import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',             // escuchar en todas las interfaces
      port: 3000,
      strictPort: true,            // no cambiar puerto automáticamente
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'web.purezanaturalis.com'  // dominio de Cloudflare
      ],
      origin: 'https://web.purezanaturalis.com',
      hmr: {
        host: 'web.purezanaturalis.com',
        protocol: 'wss',
        clientPort: 443
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['framer-motion']
          }
        }
      }
    }
  };
});
