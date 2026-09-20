import {defineConfig} from 'vitest/config';
// @ts-expect-error -- plain ESM build helper, intentionally untyped
import {stylexTestPlugin} from './scripts/vite-stylex-plugin.mjs';

export default defineConfig({
  plugins: [stylexTestPlugin()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
