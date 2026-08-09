import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/components/GlobalSearchModal.jsx']
    }
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
