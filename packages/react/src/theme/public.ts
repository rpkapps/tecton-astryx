/**
 * `@tecton/react/theme`
 *
 * The design tokens, the icon registry Tecton's theme carries, and a handle on
 * the theme itself. Applications style their own surfaces from `tecton` and
 * `tectonToken`; the theme is applied for them by `TectonProvider`, so the
 * handle below is only ever needed to identify which theme is in force.
 */
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
