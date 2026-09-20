/**
 * `@tecton/react/icons` — the Tecton icon set.
 *
 * 131 glyphs drawn for Tecton, each available as a component (`DrillBitIcon`)
 * and by name through {@link Icon}. Both cuts — outlined and filled — and the
 * three foundation sizes (16, 20 and 24 px) come from the same artwork, and
 * every glyph paints in `currentColor`, so an icon takes the colour of the text
 * beside it.
 *
 * @example
 * import {Icon, DrillBitIcon} from '@tecton/react/icons';
 *
 * <Icon name="drill-bit" size={20} />
 * <Button label="Start" icon="play" />
 */
export {Icon} from '../components/Icon/Icon.js';
export type {IconProps} from '../components/Icon/Icon.js';

export {tectonIconNames} from './names.js';
export type {TectonIconName} from './names.js';
export {tectonIconRegistry} from './registry.js';
export type {
  TectonIconGlyph,
  TectonIconGlyphProps,
  TectonIconSize,
  TectonIconVariant,
} from './glyph.js';
export type {TectonIconRef} from './renderIcon.js';

export * from './generated/index.js';
