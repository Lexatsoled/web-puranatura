import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiTarget = env.VITE_API_URL || 'http://localhost:3001';
  return {
    // No in-repo provider keys are injected by default. If you need to
    // expose build-time variables, add them here explicitly and securely.
    // define: { /* e.g. 'process.env.SOME_KEY': JSON.stringify(env.SOME_KEY) */ },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
