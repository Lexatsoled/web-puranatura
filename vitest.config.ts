import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Run without worker threads by default to avoid concurrency
    // issues on Windows when tests share single-file resources
    // such as sqlite/prisma engine binaries.
    // `threads` isn't currently present in the TypeScript definitions
    // for the used Vitest version in this repo — silence the type
    // error so the config still sets the option at runtime.
    // @ts-ignore
    threads: false,
    environment: 'happy-dom',
    setupFiles: './vitest.setup.ts',
    include: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'test/**/*.test.ts',
      'test/**/*.test.tsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
    },
  },
});
