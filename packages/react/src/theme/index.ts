/**
 * The theme barrel used inside the package.
 *
 * `TectonProvider` reaches the built theme object through here. What consumers
 * get from `@tecton/react/theme` is `./public.ts`, which exposes the tokens,
 * the icon registry and a Tecton-typed handle on the theme rather than the
 * theme object itself — the shape of that object belongs to the layer Tecton
 * is built on and is not part of Tecton's API.
 */
export {tectonTheme} from './tecton.js';
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
