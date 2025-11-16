import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import { compression } from 'vite-plugin-compression2';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    root: path.resolve(__dirname, './'),
    define: {},
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      react(),
      visualizer({
        filename: './dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
      compression({
        algorithms: ['gzip'],
        exclude: /\.(br)$/,
      }),
      // PWA con Service Worker y offline support
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
        manifest: false, // usar public/manifest.json
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.purezanaturalis\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: { maxEntries: 100, maxAgeSeconds: 300 },
              },
            },
          ],
        },
      }),
      compression({
        algorithms: ['brotliCompress'],
        exclude: /\.(gz)$/,
      }),
      // Sentry plugin para upload de sourcemaps en producción
      ...(mode === 'production' && env.VITE_SENTRY_DSN
        ? [
            sentryVitePlugin({
              org: env.SENTRY_ORG || 'your-org',
              project: env.SENTRY_PROJECT || 'web-puranatura',
              authToken: env.SENTRY_AUTH_TOKEN,
              sourcemaps: {
                assets: './dist/assets/**',
              },
              bundleSizeOptimizations: {
                excludeDebugStatements: true,
                excludeReplayIframe: true,
                excludeReplayShadowDom: true,
                excludeReplayWorker: true,
              },
            }),
          ]
        : []),
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      fs: {
        strict: true,
        allow: [path.resolve(__dirname, '.')],
      },
      allowedHosts: ['localhost', '127.0.0.1', 'web.purezanaturalis.com'],
      hmr: {
        host: 'localhost',
        protocol: 'ws',
        clientPort: 3000,
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
    },
    build: {
      target: 'es2020',
      outDir: 'dist',
      sourcemap:
        mode === 'production' && env.VITE_SENTRY_DSN ? 'hidden' : false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          // Optimizaciones agresivas
          dead_code: true,
          unused: true,
          conditionals: true,
          booleans: true,
          if_return: true,
          join_vars: true,
          collapse_vars: true,
          reduce_vars: true,
          sequences: true,
        },
        format: {
          comments: false,
        },
        mangle: {
          safari10: true,
        },
      },
      cssCodeSplit: true,
      // Bundle size budgets and warnings - más estricto
      chunkSizeWarningLimit: 350,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Tree-shaking más agresivo
            if (id.includes('node_modules')) {
              // Separar vendor en chunks más pequeños
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('framer-motion') || id.includes('react-router')) {
                return 'ui-vendor';
              }
              if (id.includes('zustand') || id.includes('axios')) {
                return 'state-vendor';
              }
              // Todo lo demás en vendor general
              return 'vendor';
            }
            // Code splitting por rutas
            if (id.includes('/pages/')) {
              const pageName = id.split('/pages/')[1].split('/')[0].toLowerCase();
              return `page-${pageName}`;
            }
            // Utils y helpers
            if (id.includes('/utils/') || id.includes('/hooks/')) {
              return 'utils';
            }
          },
          // Optimizaciones de nombres de archivo
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || 'asset';
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          charset: 'utf-8',
        },
        // Excluir dependencias no utilizadas
        external: [],
      },
      // Optimize chunk loading for better LCP
      reportCompressedSize: true,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'zustand', 'framer-motion'],
    },
    test: {
      environment: 'jsdom', // Configurar jsdom como entorno de prueba
      setupFiles: './vitest.setup.ts', // Archivo de configuración adicional para inicializar mocks y variables
    },
  };
});
