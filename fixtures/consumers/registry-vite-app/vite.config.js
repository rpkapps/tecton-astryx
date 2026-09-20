import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Nothing special on purpose: this is what a consumer's config looks like when
 * they have installed one package from a registry and want it to build.
 *
 * `@tecton/react` is NOT aliased, deduped or pre-bundled by hand — it is
 * resolved out of `node_modules` the way npm put it there.
 */
export default defineConfig({
  plugins: [react()],
  build: {sourcemap: false},
});
