/**
 * Compiles the package's own StyleX through Babel during tests.
 *
 * `stylex.create` throws when it reaches the runtime uncompiled, so the test
 * run needs the same compiler the production build uses. The CSS it extracts is
 * irrelevant in jsdom and is discarded here; only the class names matter.
 */
import * as babel from '@babel/core';
import {babelOptionsFor, PACKAGE_ROOT} from './stylex-babel.mjs';

export function stylexTestPlugin() {
  return {
    name: 'tecton:stylex',
    enforce: 'pre',
    async transform(code, id) {
      const [filename] = id.split('?');
      if (!filename.startsWith(PACKAGE_ROOT)) return null;
      if (filename.includes('/node_modules/')) return null;
      if (!/\.tsx?$/.test(filename)) return null;

      const result = await babel.transformAsync(code, {
        ...babelOptionsFor(filename),
        sourceMaps: true,
      });
      if (!result?.code) return null;
      return {code: result.code, map: result.map};
    },
  };
}

export default stylexTestPlugin;
