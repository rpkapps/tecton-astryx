/**
 * Tecton IconButton.
 *
 * A button whose whole content is one glyph. It carries the same five emphases
 * as Button and the same two heights, and its `label` is the accessible name
 * rather than visible text, so it always has one.
 */
import type {MouseEventHandler, Ref} from 'react';
import {IconButton as BaseIconButton} from '@astryxdesign/core/IconButton';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';
import type {ControlSize} from '../../types/field.js';

/** Visual emphasis, matching Button. */
export type IconButtonVariant =
  'primary' | 'secondary' | 'tertiary' | 'outlined' | 'textOnly';

/** Control height: `md` is 32px, `sm` is 28px. */
export type IconButtonSize = ControlSize;

const VARIANT = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'ghost',
  outlined: 'outlined',
  textOnly: 'text-only',
} as const satisfies Record<IconButtonVariant, string>;

export interface IconButtonProps {
  /** Accessible name for the control — it has no visible text. */
  label: string;
  /** The glyph, by name or as an SVG component. */
  icon: TectonIconRef;
  /**
   * Visual emphasis.
   * @default 'secondary'
   */
  variant?: IconButtonVariant;
  /**
   * Control height.
   * @default 'md'
   */
  size?: IconButtonSize;
  /**
   * Prevents interaction and recesses the fill.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Shows a spinner in place of the glyph while the action is in flight.
   * @default false
   */
  isLoading?: boolean;
  /** Short text shown on hover and keyboard focus. */
  tooltip?: string;
  /** Click handler. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Ref forwarded to the underlying button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Test hook. */
  'data-testid'?: string;
}

export function IconButton({
  label,
  icon,
  variant = 'secondary',
  size = 'md',
  isDisabled = false,
  isLoading = false,
  tooltip,
  onClick,
  ref,
  'data-testid': testId,
}: IconButtonProps) {
  return (
    <BaseIconButton
      ref={ref}
      label={label}
      icon={renderIcon(icon, size === 'sm' ? 16 : 20)}
      variant={VARIANT[variant]}
      size={size}
      isDisabled={isDisabled}
      isLoading={isLoading}
      tooltip={tooltip}
      onClick={onClick}
      data-testid={testId}
    />
  );
}

IconButton.displayName = 'IconButton';
