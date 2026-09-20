/**
 * Two plugins, two jobs.
 *
 * Tailwind draws fumadocs' shell. The StyleX plugin collects every class the
 * Babel plugin compiled — out of this app's own components and out of the
 * ported examples under `examples/` — and writes them where `@stylex;` sits in
 * `src/app/global.css`. The layer order is the package's own, so a rule an
 * example writes lands after the theme it renders against rather than under it.
 *
 * The StyleX options are `babel.config.json`'s, read rather than repeated:
 * the CSS the plugin extracts has to be the CSS the classes in the compiled
 * modules were named for. That file is JSON because Next's Babel loader refuses
 * a `.cjs` or `.mjs` config and this package is `"type": "module"`, so a `.js`
 * one would be read as ESM.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const babelConfig = require('./babel.config.json');

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    '@stylexjs/postcss-plugin': {
      include: ['src/**/*.{js,jsx,ts,tsx}', 'examples/**/*.{js,jsx,ts,tsx}'],
      babelConfig: {
        babelrc: false,
        parserOpts: {plugins: ['typescript', 'jsx']},
        plugins: babelConfig.plugins,
      },
      useCSSLayers: {
        before: ['reset', 'astryx-base', 'astryx-theme'],
      },
    },
  },
};
