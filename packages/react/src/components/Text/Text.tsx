/**
 * Tecton Text.
 *
 * The type scale is Tecton's: sixteen named variants, of which Text carries the
 * fourteen that are not headings. The three `*Data` variants are the monospace
 * face every numeric readout in Tecton is set in; the two `action*` variants
 * are the label sizes controls use.
 */
import type {ReactNode} from 'react';
import {Text as BaseText} from '@astryxdesign/core/Text';

/** A variant from the Tecton type scale that Text can be set in. */
export type TextVariant =
  | 'display1'
  | 'display2'
  | 'display3'
  | 'large'
  | 'medium'
  | 'mediumStrong'
  | 'small'
  | 'smallStrong'
  | 'tiny'
  | 'largeData'
  | 'mediumData'
  | 'smallData'
  | 'actionMedium'
  | 'actionSmall';

/** The weights Tecton's type foundation names. */
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

/** Ink roles text can be set in. */
export type TextColor =
  'primary' | 'secondary' | 'disabled' | 'placeholder' | 'accent' | 'inherit';

/** Which element the text renders as. */
export type TextElement = 'span' | 'p' | 'div' | 'label';

/** Tecton variant → the type-scale role underneath. */
const VARIANT = {
  display1: 'display-1',
  display2: 'display-2',
  display3: 'display-3',
  large: 'large',
  medium: 'body',
  small: 'supporting',
  mediumStrong: 'mediumStrong',
  smallStrong: 'smallStrong',
  tiny: 'tiny',
  largeData: 'largeData',
  mediumData: 'mediumData',
  smallData: 'smallData',
  actionMedium: 'actionMedium',
  actionSmall: 'actionSmall',
} as const satisfies Record<TextVariant, string>;

/** Tecton weight name → the font-weight role underneath. */
export const TEXT_WEIGHT = {
  regular: 'normal',
  medium: 'medium',
  semibold: 'semibold',
  bold: 'bold',
} as const satisfies Record<TextWeight, string>;

export interface TextProps {
  /** The text itself. */
  children: ReactNode;
  /**
   * Which variant of the Tecton type scale to set the text in.
   * @default 'medium'
   */
  variant?: TextVariant;
  /** Font weight, overriding the weight the variant carries. */
  weight?: TextWeight;
  /**
   * Ink role.
   * @default 'primary'
   */
  color?: TextColor;
  /**
   * Whether the text flows inline or forms its own block.
   * @default 'inline'
   */
  display?: 'inline' | 'block';
  /**
   * Which element to render.
   * @default 'span'
   */
  as?: TextElement;
  /**
   * Maximum number of lines before the text truncates with an ellipsis. `0`
   * never truncates.
   * @default 0
   */
  maxLines?: number;
  /**
   * Alignment within the text's own box.
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
  /** Renders the text struck through. */
  isStruckThrough?: boolean;
  /** Lines up digits in columns — use it for any number in a table. */
  hasTabularNumbers?: boolean;
  /** Id applied to the text element. */
  id?: string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Text({
  children,
  variant = 'medium',
  weight,
  color = 'primary',
  display = 'inline',
  as = 'span',
  maxLines = 0,
  align = 'start',
  isStruckThrough = false,
  hasTabularNumbers = false,
  id,
  'data-testid': testId,
}: TextProps) {
  return (
    <BaseText
      type={VARIANT[variant]}
      weight={weight === undefined ? undefined : TEXT_WEIGHT[weight]}
      color={color}
      display={display}
      as={as}
      maxLines={maxLines}
      justify={align}
      hasStrikethrough={isStruckThrough}
      hasTabularNumbers={hasTabularNumbers}
      id={id}
      data-testid={testId}
    >
      {children}
    </BaseText>
  );
}

Text.displayName = 'Text';
