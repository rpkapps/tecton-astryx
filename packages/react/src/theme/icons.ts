/**
 * Tecton icon registry.
 *
 * Semantic icon names mapped to inline SVG elements. The registry lives in its
 * own module (and is imported by name from `tectonTheme.ts`) because the theme
 * compiler emits a sidecar import for the registry rather than inlining it.
 * The module is compiled to `dist/theme/icons.js`, which is exactly where the
 * generated built theme imports it from.
 *
 * Two constraints shape the code here:
 *
 * - **No JSX.** The theme compiler evaluates this module with a synchronous
 *   loader that compiles JSX against the classic runtime, which needs `React`
 *   in scope; `createElement` sidesteps that and keeps the module a plain
 *   `.ts` file the loader can resolve from `./icons.js`.
 * - **No icon dependency.** Tecton's own gallery is 131 bespoke glyphs, about
 *   a quarter of them subsurface-domain shapes with no equivalent in any icon
 *   library. Shipping them is its own piece of work (see the fidelity report);
 *   until then the registry stays at the few generic marks below and every
 *   other semantic icon falls through to the default set.
 */
import {createElement, type ReactNode} from 'react';
import type {IconRegistry} from '@astryxdesign/core/Icon';

/** Semantic icon names Tecton components resolve through the active theme. */
export type TectonIconRegistry = Partial<IconRegistry>;

/** Tecton's gallery draws at a 1.5px stroke with rounded caps and joins. */
const svgProps = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

/** One outlined glyph from a list of path data. */
function glyph(...paths: readonly string[]): ReactNode {
  return createElement(
    'svg',
    svgProps,
    ...paths.map((d, index) => createElement('path', {d, key: index})),
  );
}

/** The icon set Tecton ships with its theme. */
export const tectonIcons: TectonIconRegistry = {
  close: glyph('M18 6 6 18', 'm6 6 12 12'),
  check: glyph('M20 6 9 17l-5-5'),
  chevronDown: glyph('m6 9 6 6 6-6'),
};
