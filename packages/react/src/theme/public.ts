/**
 * `@tecton/react/theme`
 *
 * Two things live at this subpath, and both belong here.
 *
 * **Tecton's theme.** The design tokens, the icon registry Tecton's theme
 * carries, and a handle on the theme itself. Applications style their own
 * surfaces from `tecton` and `tectonToken`; the theme is applied for them by
 * `TectonProvider`, so the handle below is only ever needed to identify which
 * theme is in force.
 *
 * **The theme runtime.** `Theme`, `defineTheme`, `useTheme`, the token var
 * maps and everything else the component system's own `theme` module exports,
 * re-exported unchanged — this is the subpath that module lives at, and a
 * consumer defining a theme of their own, or reading the active one, needs it.
 *
 * The two do not collide: every Tecton name here is prefixed `tecton` or
 * `Tecton`, and no name in the runtime module is. The star export below is
 * therefore total — nothing upstream is shadowed or unreachable.
 */
export * from '@astryxdesign/core/theme';

// The theme's custom variants and text types, as declarations a consumer
// type-checks against. Imported for the side effect: it declares no value.
import './variants.js';

import {tectonTheme as builtTectonTheme} from './tecton.js';

/**
 * A handle on the built Tecton theme.
 *
 * The theme itself is applied by `TectonProvider` and needs no configuration,
 * so this is deliberately opaque: everything a consumer can do with it is read
 * its name.
 */
export interface TectonTheme {
  /**
   * The theme's name, which is also the value of the theme attribute Tecton
   * sets on the element it is applied to.
   */
  readonly name: string;
}

/** The built Tecton theme, as `TectonProvider` applies it. */
export const tectonTheme: TectonTheme = builtTectonTheme;

export {tectonIcons} from './icons.js';
export type {TectonIconRegistry, TectonSemanticIconName} from './icons.js';
export {
  tecton,
  colorTokens,
  spacingTokens,
  radiusTokens,
  shadowTokens,
  sizeTokens,
  borderTokens,
  durationTokens,
  textSizeTokens,
  typeScaleTokens,
  typographyTokens,
  tectonToken,
} from './tokens.js';
export type {TectonTokenName, TectonTokens} from './tokens.js';
