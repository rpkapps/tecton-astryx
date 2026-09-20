/**
 * The one StyleX/Babel configuration for @tecton/react.
 *
 * Shared by the production build (scripts/build.mjs) and the test run
 * (vitest.config.ts), so components are compiled the same way in both.
 */
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import styleXBabelPlugin from '@stylexjs/babel-plugin';

export const PACKAGE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

/** StyleX compiler options. `dev: false` keeps debug classes out of the CSS. */
export const styleXOptions = {
  dev: false,
  runtimeInjection: false,
  classNamePrefix: 'tecton',
  treeshakeCompensation: true,
  enableInlinedConditionalMerge: true,
  unstable_moduleResolution: {
    type: 'commonJS',
    rootDir: PACKAGE_ROOT,
  },
  aliases: {
    '@tecton/react/*': [path.join(PACKAGE_ROOT, 'src', '*')],
  },
};

/** Babel options for one source file. */
export function babelOptionsFor(filename) {
  return {
    filename,
    cwd: PACKAGE_ROOT,
    root: PACKAGE_ROOT,
    babelrc: false,
    configFile: false,
    sourceType: 'module',
    presets: [
      [
        '@babel/preset-typescript',
        {isTSX: filename.endsWith('.tsx'), allExtensions: true},
      ],
      ['@babel/preset-react', {runtime: 'automatic'}],
    ],
    plugins: [[styleXBabelPlugin, styleXOptions]],
  };
}

export {styleXBabelPlugin};
