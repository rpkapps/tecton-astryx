/**
 * Tecton Chip.
 *
 * A compact, removable label for one value: a filter that is on, a tag on a
 * record, a selection the user can take back. A chip with `onRemove` grows an
 * X; a chip with `onClick` behaves as a button.
 */
import type {MouseEvent} from 'react';
import {Token} from '@astryxdesign/core/Token';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';

/** Chip height: `lg` is 24px, `md` 20px, `sm` 18px. */
export type ChipSize = 'sm' | 'md' | 'lg';

/** Colour role. */
export type ChipColor =
  'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';

const COLOR = {
  default: 'default',
  primary: 'purple',
  info: 'blue',
  success: 'green',
  warning: 'orange',
  error: 'red',
} as const satisfies Record<ChipColor, string>;

export interface ChipProps {
  /** The chip text. */
  label: string;
  /**
   * Chip height.
   * @default 'md'
   */
  size?: ChipSize;
  /**
   * Colour role.
   * @default 'default'
   */
  color?: ChipColor;
  /** Glyph rendered before the label, by name or as an SVG component. */
  icon?: TectonIconRef;
  /**
   * Prevents interaction and dims the chip.
   * @default false
   */
  isDisabled?: boolean;
  /** When set, the chip carries a remove button that calls this. */
  onRemove?: (event: MouseEvent) => void;
  /** When set without `onRemove`, the whole chip behaves as a button. */
  onClick?: (event: MouseEvent) => void;
  /** Test hook. */
  'data-testid'?: string;
}

export function Chip({
  label,
  size = 'md',
  color = 'default',
  icon,
  isDisabled = false,
  onRemove,
  onClick,
  'data-testid': testId,
}: ChipProps) {
  return (
    <Token
      label={label}
      size={size}
      color={COLOR[color]}
      icon={renderIcon(icon, 16)}
      isDisabled={isDisabled}
      onRemove={onRemove}
      onClick={onClick}
      data-testid={testId}
    />
  );
}

Chip.displayName = 'Chip';
