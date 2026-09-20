import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = path.join(here, '..');

/**
 * One config, three bundles. `MFE_TARGET` picks which.
 *
 * Each bundle is a self-contained IIFE: its own React, its own copy of
 * `@tecton/react`, and therefore its own copy of everything underneath.
 * Nothing is external and nothing is shared between them — which is the whole
 * point of the harness.
 *
 * The two containers share one source directory, so the version each binds to
 * is pinned by alias rather than by node_modules lookup. The stylesheets are
 * deliberately NOT imported from the bundles: the host page links them itself,
 * which is what lets the spec control load order and entry point.
 */
const TARGETS = {
  a: {
    version: 'tecton-a',
    entry: 'containers/a/src/index.jsx',
    name: 'ContainerA',
    file: 'container-a.js',
  },
  b: {
    version: 'tecton-b',
    entry: 'containers/b/src/index.jsx',
    name: 'ContainerB',
    file: 'container-b.js',
  },
  'host-shell': {
    version: 'tecton-b',
    entry: 'containers/host-shell/src/index.jsx',
    name: 'HostShell',
    file: 'host-shell.js',
  },
};

const target = TARGETS[process.env.MFE_TARGET ?? 'a'];
if (!target) {
  throw new Error(`Unknown MFE_TARGET: ${process.env.MFE_TARGET}`);
}

export default defineConfig({
  plugins: [react()],
  // Library mode does not substitute this, and React's build reads it.
  define: {'process.env.NODE_ENV': JSON.stringify('production')},
  resolve: {
    alias: [
      {
        find: /^@tecton\/react$/,
        replacement: path.join(
          FIXTURE,
          'dist/versions',
          target.version,
          'index.js',
        ),
      },
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
      fileName: () => target.file,
    },
    rollupOptions: {external: []},
    minify: false,
  },
});
