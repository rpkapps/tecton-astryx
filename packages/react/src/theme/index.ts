/**
 * `@tecton/react/theme`
 *
 * Exposes the built theme object that `TectonProvider` applies, the icon
 * registry it carries, and the token helpers for application styles.
 */
export {tectonTheme} from './tecton.js';
export {tectonIcons} from './icons.js';
export type {TectonIconRegistry} from './icons.js';
export {
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
export type {TectonTokenName} from './tokens.js';
