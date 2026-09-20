/**
 * Tecton Heading.
 *
 * `level` sets both the HTML element and, by default, the size: Tecton names
 * `heading1` and `heading2` and the ladder continues into the interface
 * variants below them. `variant` overrides the size with one of the three
 * display sizes without changing the element, which is how a data callout gets
 * to be large and still sit correctly in the document outline.
 */
import type {ReactNode} from 'react';
import {Heading as BaseHeading} from '@astryxdesign/core/Heading';
import {TEXT_WEIGHT, type TextColor, type TextWeight} from '../Text/Text.js';

/** Heading rank, 1–6. Sets the element and the default size. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** The display sizes a heading can be set in instead of its level's size. */
export type HeadingVariant = 'display1' | 'display2' | 'display3';

const VARIANT = {
  display1: 'display-1',
  display2: 'display-2',
  display3: 'display-3',
} as const satisfies Record<HeadingVariant, string>;

export interface HeadingProps {
  /** The heading text. */
  children: ReactNode;
  /** Heading rank, 1–6: the element rendered and the size used. */
  level: HeadingLevel;
  /** A display size to use instead of the level's own size. */
  variant?: HeadingVariant;
  /** Font weight, overriding the weight the level or variant carries. */
  weight?: TextWeight;
  /**
   * Ink role.
   * @default 'primary'
   */
  color?: TextColor;
  /**
   * Rank announced to assistive technology, when the visual rank and the
   * document outline have to differ.
   */
  outlineLevel?: HeadingLevel;
  /**
   * Maximum number of lines before the heading truncates with an ellipsis. `0`
   * never truncates.
   * @default 0
   */
  maxLines?: number;
  /**
   * Alignment within the heading's own box.
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
  /** Id applied to the heading element. */
  id?: string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Heading({
  children,
  level,
  variant,
  weight,
  color = 'primary',
  outlineLevel,
  maxLines = 0,
  align = 'start',
  id,
  'data-testid': testId,
}: HeadingProps) {
  return (
    <BaseHeading
      level={level}
      type={variant === undefined ? undefined : VARIANT[variant]}
      weight={weight === undefined ? undefined : TEXT_WEIGHT[weight]}
      color={color}
      accessibilityLevel={outlineLevel}
      maxLines={maxLines}
      justify={align}
      id={id}
      data-testid={testId}
    >
      {children}
    </BaseHeading>
  );
}

Heading.displayName = 'Heading';
