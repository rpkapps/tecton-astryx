/**
 * How this site compiles StyleX.
 *
 * Eighteen of the ported examples style themselves with `@stylexjs/stylex` and
 * seven of those read `@tecton/react/theme/tokens.stylex`. They are shown as
 * source and run in the reader's browser, so the site has to compile them the
 * way a consumer's build would — with the options the package itself builds
 * with, or the class names in the compiled modules would not be the class names
 * in the extracted CSS.
 *
 * The one option that is not the compiler's is `useCSSLayers`: the extracted
 * sheet declares `reset`, `astryx-base` and `astryx-theme` before StyleX's own
 * priority layers, so a rule an example writes about a component lands after
 * the theme it renders against rather than under it. That is the order the
 * PostCSS plugin was asked for when the site was built with webpack.
 */
export const styleXOptions = {
  dev: false,
  runtimeInjection: false,
  classNamePrefix: 'tecton',
  treeshakeCompensation: true,
  enableInlinedConditionalMerge: true,
  unstable_moduleResolution: /** @type {const} */ ({type: 'commonJS'}),
  useCSSLayers: {before: ['reset', 'astryx-base', 'astryx-theme']},
};
