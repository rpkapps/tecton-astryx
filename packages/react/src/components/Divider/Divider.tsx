/**
 * Tecton Divider.
 *
 * A hairline between two pieces of content. Tecton names three emphases and
 * they differ only in colour — every divider is 1px, whatever its weight.
 */
import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {colorVars} from '@astryxdesign/core/theme/tokens.stylex';
import {Divider as BaseDivider} from '@astryxdesign/core/Divider';

/** How strongly the rule reads. */
export type DividerVariant = 'subtle' | 'medium' | 'strong';

const styles = stylex.create({
  // The rule underneath has two weights; Tecton's middle one is painted here
  // from the same token the theme would have used for it.
  medium: {backgroundColor: colorVars['--color-border-emphasized']},
});

export interface DividerProps {
  /**
   * Which way the rule runs.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * How strongly the rule reads.
   * @default 'subtle'
   */
  variant?: DividerVariant;
  /** Text centred on the rule. */
  label?: ReactNode;
  /**
   * Extends the rule to the edges of its container, past the container's own
   * padding.
   * @default false
   */
  isFullBleed?: boolean;
  /** Test hook. */
  'data-testid'?: string;
}

export function Divider({
  orientation = 'horizontal',
  variant = 'subtle',
  label,
  isFullBleed = false,
  'data-testid': testId,
}: DividerProps) {
  return (
    <BaseDivider
      orientation={orientation}
      variant={variant === 'strong' ? 'strong' : 'subtle'}
      xstyle={variant === 'medium' ? styles.medium : undefined}
      label={label}
      isFullBleed={isFullBleed}
      data-testid={testId}
    />
  );
}

Divider.displayName = 'Divider';
