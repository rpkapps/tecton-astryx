import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const FIXTURE = path.dirname(fileURLToPath(import.meta.url));

/**
 * One config, two bundles. `MFE_TARGET` (`a` or `b`) picks which.
 *
 * Both containers render the same source. What differs is what that source
 * resolves to: `@tecton/react` is aliased to the npm alias the container owns
 * — `tecton-a` is `npm:@tecton/react@<A>` and `tecton-b` is
 * `npm:@tecton/react@<B>`, two real installs of two real published versions —
 * and `react` / `react-dom` are aliased the same way, so each container also
 * gets its own copy of React rather than a hoisted shared one.
 *
 * Each bundle is a self-contained IIFE (`external: []`), which is what makes
 * the two copies of Tecton genuinely separate module instances at runtime.
 *
 * The stylesheets are deliberately NOT imported from the bundles: the host
 * page links them, because which sheets a page loads (and in what order) is
 * the host's decision, not a container's.
 */
const TARGETS = {
  a: {entry: 'containers/a/src/index.jsx', name: 'ContainerA'},
  b: {entry: 'containers/b/src/index.jsx', name: 'ContainerB'},
};

const id = process.env.MFE_TARGET ?? 'a';
const target = TARGETS[id];
if (!target) throw new Error(`Unknown MFE_TARGET: ${process.env.MFE_TARGET}`);

export default defineConfig({
  plugins: [react()],
  // Library mode does not substitute this, and React's build reads it.
  define: {'process.env.NODE_ENV': JSON.stringify('production')},
  resolve: {
    alias: [
      {find: /^@tecton\/react$/, replacement: `tecton-${id}`},
      {find: /^@tecton\/react\/(.*)$/, replacement: `tecton-${id}/$1`},
      {find: /^react$/, replacement: `react-${id}`},
      {find: /^react\/(.*)$/, replacement: `react-${id}/$1`},
      {find: /^react-dom$/, replacement: `react-dom-${id}`},
      {find: /^react-dom\/(.*)$/, replacement: `react-dom-${id}/$1`},
    ],
  },
  build: {
    outDir: path.join(FIXTURE, 'dist/host'),
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: path.join(FIXTURE, target.entry),
      name: target.name,
      formats: ['iife'],
      fileName: () => `container-${id}.js`,
    },
    rollupOptions: {external: []},
    minify: false,
  },
});
