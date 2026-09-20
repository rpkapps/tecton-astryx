/**
 * The shape of a Tecton glyph component.
 *
 * Every glyph in `src/icons/generated/` is an ordinary SVG component: it takes
 * the SVG props React knows about plus Tecton's `variant`, and paints in
 * `currentColor`, so it can be handed to any Tecton prop that accepts an icon
 * without a wrapper.
 */
import type {FunctionComponent, SVGProps} from 'react';

/** Outlined glyphs are the default; filled ones read louder on dark surfaces. */
export type TectonIconVariant = 'outline' | 'filled';

/** Props every Tecton glyph component accepts. */
export interface TectonIconGlyphProps extends SVGProps<SVGSVGElement> {
  /**
   * Which cut of the glyph to draw.
   * @default 'outline'
   */
  variant?: TectonIconVariant;
}

/** A Tecton glyph component, as the registry stores it. */
export type TectonIconGlyph = FunctionComponent<TectonIconGlyphProps>;

/** The rendered size of a Tecton icon, in pixels. */
export type TectonIconSize = 16 | 20 | 24;
