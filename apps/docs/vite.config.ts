import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import {tanstackStart} from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {fumadocsMdx} from 'fumadocs-mdx/vite';
import stylex from '@stylexjs/unplugin/vite';
import {styleXOptions} from './scripts/stylex-options.mjs';
import {isSitePath, prerenderPages} from './scripts/prerender-pages.mjs';
import {stylexCssPlugin} from './scripts/vite-stylex-css.mjs';

/**
 * The docs site, on Vite.
 *
 * `pnpm --filter @tecton/docs build` is a **static export**: every route the
 * generator wrote is prerendered into `dist/client` as plain HTML that any file
 * server can host. Nothing runs at request time — the examples are fetched and
 * mounted in the reader's browser after hydration, and `/api/search` is a JSON
 * document written at build time rather than a server.
 *
 * The plugins that carry it:
 *
 * - `fumadocsMdx` compiles `content/docs/**` and expands the `defineDocs`
 *   macro in `src/lib/source.ts` into the globs that back it. The collection is
 *   **async**, so a page's compiled MDX is its own chunk: opening one page
 *   loads one page, which is the whole reason the site is no longer slow.
 * - `tanstackStart` is the framework — file routes under `src/routes`, SSR, and
 *   the prerenderer.
 * - `tailwindcss` draws fumadocs' shell.
 * - `stylex` compiles the eighteen examples that style themselves with StyleX,
 *   with the package's own compiler options, and `stylexCssPlugin` writes the
 *   classes it extracted into `src/styles/stylex.css` — after the design
 *   system's cascade layers, which is where a rule about a component has to sit
 *   to outrank the component's theme.
 */
const stylexPlugin = stylex(styleXOptions);

export default defineConfig({
  // The repository's README sends a reader to http://localhost:3000, and the
  // docs site is the only thing in it that serves a page.
  server: {port: 3000},
  resolve: {
    alias: {
      // The same `@/*` the app's tsconfig declares. The build resolves it
      // through the route plugin; the dev server's dependency scanner does not,
      // so it is spelled out here and both agree.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    fumadocsMdx(),
    stylexPlugin,
    stylexCssPlugin(stylexPlugin),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        // Every page on this site renders running examples, and a page
        // template is a whole screen with links of its own — to `/team/alex`,
        // to `/invoices/3`, to wherever the design it was drawn from went.
        // Those are part of the example, not routes here, so the crawler is
        // held to the pages the generator wrote.
        filter: ({path}) => isSitePath(path),
        concurrency: 4,
        failOnError: true,
      },
      // Crawling finds a page only if something already prerendered links to
      // it; the generator knows all 217 of them, and `/api/search` is linked
      // from nowhere at all because the dialog fetches it.
      pages: prerenderPages(),
    }),
    viteReact(),
  ],
});
