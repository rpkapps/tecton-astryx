/**
 * Tecton Card.
 *
 * A bounded surface for one thing: a record, a summary, a choice. Like every
 * Tecton surface it is darker than the page it sits on and carries a rule
 * rather than a shadow.
 */
import type {ReactNode} from 'react';
import {Card as BaseCard} from '@astryxdesign/core/Card';

/** How the card's background reads against the page. */
export type CardVariant = 'default' | 'muted' | 'transparent';

/** A step on the 4px spacing grid. */
export type CardPadding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10;

export interface CardProps {
  /** The card's content. */
  children?: ReactNode;
  /**
   * How the card's background reads against the page.
   * @default 'default'
   */
  variant?: CardVariant;
  /** Inner padding, as a step on the spacing grid. Omit for Tecton's 16px. */
  padding?: CardPadding;
  /** Width — a number is pixels, a string is used as-is. */
  width?: number | string;
  /** Maximum width — a number is pixels, a string is used as-is. */
  maxWidth?: number | string;
  /** Minimum height — a number is pixels, a string is used as-is. */
  minHeight?: number | string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Card({
  children,
  variant = 'default',
  padding,
  width,
  maxWidth,
  minHeight,
  'data-testid': testId,
}: CardProps) {
  return (
    <BaseCard
      variant={variant}
      padding={padding}
      width={width}
      maxWidth={maxWidth}
      minHeight={minHeight}
      data-testid={testId}
    >
      {children}
    </BaseCard>
  );
}

Card.displayName = 'Card';
