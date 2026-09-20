/**
 * `@tecton/react/icons` — the Tecton icon set.
 *
 * 131 glyphs drawn for Tecton, each an ordinary SVG component
 * (`DrillBitIcon`, `SearchIcon`, …) that paints in `currentColor`, so a glyph
 * takes the colour of the text beside it and can be handed to any prop that
 * takes an icon.
 *
 * The same glyphs also back the theme's icon registry (`src/theme/icons.ts`),
 * which is what replaces the component system's default glyphs wherever a
 * component asks the theme for one by role. So an application that never
 * imports from here still gets Tecton's icons inside Tecton's components;
 * these exports are for the icons an application draws itself.
 *
 * @example
 * import {DrillBitIcon} from '@tecton/react/icons';
 * import {Button} from '@tecton/react';
 *
 * <Button label="Start" icon={DrillBitIcon} />
 * <DrillBitIcon width={20} height={20} aria-hidden="true" />
 */
export {tectonIconNames} from './names.js';
export type {TectonIconName} from './names.js';
export {tectonIconRegistry} from './registry.js';
export type {
  TectonIconGlyph,
  TectonIconGlyphProps,
  TectonIconSize,
  TectonIconVariant,
} from './glyph.js';

export * from './generated/index.js';
