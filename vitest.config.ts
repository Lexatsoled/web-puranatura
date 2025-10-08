/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@/src': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'components'),
      '@/contexts': path.resolve(__dirname, 'contexts'),
      '@/hooks': path.resolve(__dirname, 'hooks'),
      '@/pages': path.resolve(__dirname, 'pages'),
      '@/data': path.resolve(__dirname, 'data'),
      '@/types': path.resolve(__dirname, 'src/types')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    // Include only hook tests for now
    include: ['test/hooks/**/*.test.ts'],
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@/src': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'components'),
      '@/contexts': path.resolve(__dirname, 'contexts'),
      '@/hooks': path.resolve(__dirname, 'hooks'),
      '@/pages': path.resolve(__dirname, 'pages'),
      '@/data': path.resolve(__dirname, 'data'),
      '@/types': path.resolve(__dirname, 'src/types')
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks for external dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('framer-motion')) {
              return 'ui';
            }
            if (id.includes('router')) {
              return 'router';
            }
            return 'vendor';
          }
          
          // Data chunk for product data and business logic
          if (id.includes('/data/')) {
            return 'data';
          }
          
          // Store chunk for state management
          if (id.includes('/store/') || id.includes('zustand')) {
            return 'store';
          }
          
          // Router chunk for routing logic
          if (id.includes('/pages/') || id.includes('router')) {
            return 'pages';
          }
          
          // UI chunk for component library and animations
          if (id.includes('/components/') && (
            id.includes('Modal') || 
            id.includes('Card') || 
            id.includes('Button') ||
            id.includes('Layout')
          )) {
            return 'ui';
          }
          
          // Components chunk for other components
          if (id.includes('/components/')) {
            return 'components';
          }
          
          // Default chunk for everything else
          return 'main';
        }
      }
    }
  }
});