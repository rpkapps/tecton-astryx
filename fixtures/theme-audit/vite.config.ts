/**
 * One config, two flavours.
 *
 * `mode=tecton` serves the examples as written — `@tecton/react/*`, the built
 * package, the Tecton theme. `mode=neutral` rewrites every
 * `@tecton/react/<Module>` specifier to `@astryxdesign/core/<Module>` so the
 * very same example files render on upstream's untouched components, which is
 * what upstream's own docs site shows under `@astryxdesign/theme-neutral`.
 *
 * `@tecton/react/icons` is deliberately left alone on both sides: the glyphs
 * are plain SVG components with no theme in them, so keeping them identical
 * means an icon that measures differently measures differently *because of the
 * theme*.
 *
 * Both sides resolve from this fixture rather than from the example's own
 * directory (the examples live in `apps/docs`, which has no `@astryxdesign/*`
 * of its own), which is why this is a resolver plugin rather than a plain
 * `resolve.alias`.
 *
 * Plugins otherwise mirror `fixtures/consumers/vite-app`: the package and core
 * are both consumed built, with their StyleX already compiled and their CSS
 * shipped. Seven of the examples write StyleX of their own, though, and
 * `stylex.create` throws if it reaches the runtime uncompiled — so those go
 * through the same Babel pass `packages/react/scripts/vite-stylex-plugin.mjs`
 * uses, on both sides, so whatever the compiler does to them it does equally.
 */
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import * as babel from '@babel/core';
import presetTypeScript from '@babel/preset-typescript';
import styleXBabelPlugin from '@stylexjs/babel-plugin';
import {defineConfig, type Plugin} from 'vite';
import react from '@vitejs/plugin-react';

const here = fileURLToPath(new URL('.', import.meta.url));
const requireFromHere = createRequire(
  new URL('./package.json', import.meta.url),
);

/** Rewrite the examples' `@tecton/react/*` imports onto one side or the other. */
function resolveSurface(side: 'tecton' | 'neutral'): Plugin {
  return {
    name: 'theme-audit:surface',
    enforce: 'pre',
    resolveId(source) {
      if (source !== '@tecton/react' && !source.startsWith('@tecton/react/')) {
        return null;
      }
      // Tecton's own glyph components are theme-free SVGs; both sides draw the
      // same ones so that an icon size difference can only be the theme's.
      const subpath = source.slice('@tecton/react'.length);
      const target =
        side === 'tecton' || subpath === '/icons'
          ? source
          : `@astryxdesign/core${subpath}`;
      try {
        return requireFromHere.resolve(target);
      } catch {
        return null;
      }
    },
  };
}

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

/** Compile the examples' own StyleX, exactly as the package's test run does. */
function exampleStyleX(): Plugin {
  return {
    name: 'theme-audit:stylex',
    enforce: 'pre',
    async transform(code, id) {
      const [filename] = id.split('?');
      if (!filename.includes('/apps/docs/examples/')) return null;
      if (!/\.tsx?$/.test(filename)) return null;
      if (!code.includes('@stylexjs/stylex')) return null;
      const result = await babel.transformAsync(code, {
        filename,
        cwd: repoRoot,
        root: repoRoot,
        babelrc: false,
        configFile: false,
        sourceType: 'module',
        // The presets are passed as modules, not names: Babel resolves a name
        // against `root`, which is the repository, and the compiler lives in
        // this fixture's own node_modules.
        presets: [
          [
            presetTypeScript,
            {isTSX: filename.endsWith('.tsx'), allExtensions: true},
          ],
        ],
        plugins: [
          [
            styleXBabelPlugin,
            {
              dev: false,
              runtimeInjection: true,
              treeshakeCompensation: true,
              unstable_moduleResolution: {type: 'commonJS', rootDir: repoRoot},
            },
          ],
        ],
        sourceMaps: true,
      });
      if (!result?.code) return null;
      return {code: result.code, map: result.map};
    },
  };
}

export default defineConfig(({mode}) => {
  const side = mode === 'neutral' ? 'neutral' : 'tecton';
  return {
    root: here,
    // Relative, so the built pages work from any static root.
    base: './',
    plugins: [resolveSurface(side), exampleStyleX(), react()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    build: {
      // Each side is built once and served static. On a dev server every one of
      // the package's ~1700 modules is a separate request with its own
      // transform, and 646 page loads of that is hours; bundled, a page load is
      // two requests.
      outDir: `dist/${side}`,
      emptyOutDir: true,
      target: 'esnext',
      minify: false,
      sourcemap: false,
      chunkSizeWarningLimit: 100_000,
      rollupOptions: {
        input: {
          [side]: `${here}${side === 'neutral' ? 'neutral' : 'tecton'}.html`,
        },
      },
    },
    server: {
      fs: {
        // The examples live in apps/docs, outside this fixture.
        allow: [fileURLToPath(new URL('../..', import.meta.url))],
      },
    },
  };
});
