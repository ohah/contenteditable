/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'path';

import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  plugins: [
    {
      ...eslint({
        include: ['/src/**/*.+(ts|tsx)', `${path.resolve(__dirname, '')}/*.cjs`],
      }),
      enforce: 'pre',
    },
    tsconfigPaths(),
  ],
});
