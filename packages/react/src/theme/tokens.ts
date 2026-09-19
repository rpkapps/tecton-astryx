/**
 * Token helpers.
 *
 * The maps below name every design token Tecton exposes and resolve to the
 * matching CSS custom property, so application code can reach a token from
 * plain inline styles or any CSS-in-JS layer without hardcoding values.
 */
import {
  colorVars,
  spacingVars,
  radiusVars,
  shadowVars,
  sizeVars,
  borderVars,
  durationVars,
  textSizeVars,
  typeScaleVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';

export const colorTokens = colorVars;
export const spacingTokens = spacingVars;
export const radiusTokens = radiusVars;
export const shadowTokens = shadowVars;
export const sizeTokens = sizeVars;
export const borderTokens = borderVars;
export const durationTokens = durationVars;
export const textSizeTokens = textSizeVars;
export const typeScaleTokens = typeScaleVars;
export const typographyTokens = typographyVars;

/** A Tecton design token, written as its CSS custom property name. */
export type TectonTokenName = `--${string}`;

/**
 * Reference a design token from a style value.
 *
 * @example
 * <div style={{color: tectonToken('--color-text-primary')}} />
 */
export function tectonToken(name: TectonTokenName): string {
  return `var(${name})`;
}
