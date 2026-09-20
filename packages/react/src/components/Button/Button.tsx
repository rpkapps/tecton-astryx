/**
 * Tecton Button.
 *
 * Five emphases, in the ladder the design draws them: each step down removes
 * one piece of chrome — a bright fill, a dark fill, a fill that only appears on
 * hover, an outline, then nothing — and the label dims one step with it.
 */
import type {MouseEventHandler, Ref} from 'react';
import {Button as BaseButton} from '@astryxdesign/core/Button';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';
import type {ControlSize} from '../../types/field.js';

/** Visual emphasis, from the loudest to the quietest. */
export type ButtonVariant =
  'primary' | 'secondary' | 'tertiary' | 'outlined' | 'textOnly';

/** Control height: `md` is 32px, `sm` is 28px. */
export type ButtonSize = ControlSize;

const VARIANT = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'ghost',
  outlined: 'outlined',
  textOnly: 'text-only',
} as const satisfies Record<ButtonVariant, string>;

export interface ButtonProps {
  /** The visible text, which is also the accessible name of the control. */
  label: string;
  /**
   * Visual emphasis.
   * @default 'secondary'
   */
  variant?: ButtonVariant;
  /**
   * Control height.
   * @default 'md'
   */
  size?: ButtonSize;
  /** Glyph rendered before the label, by name or as an SVG component. */
  icon?: TectonIconRef;
  /**
   * Prevents interaction and recesses the fill.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Shows a spinner in place of the icon and blocks interaction while the
   * action is in flight.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Stretches the button across its container — the shape a panel's committing
   * action takes.
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * HTML button type.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /** Short text shown on hover and keyboard focus. */
  tooltip?: string;
  /** Click handler. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Ref forwarded to the underlying button element. */
  ref?: Ref<HTMLButtonElement>;
  /** Test hook. */
  'data-testid'?: string;
}

export function Button({
  label,
  variant = 'secondary',
  size = 'md',
  icon,
  isDisabled = false,
  isLoading = false,
  isFullWidth = false,
  type = 'button',
  tooltip,
  onClick,
  ref,
  'data-testid': testId,
}: ButtonProps) {
  return (
    <BaseButton
      ref={ref}
      label={label}
      variant={VARIANT[variant]}
      size={size}
      icon={renderIcon(icon, size === 'sm' ? 16 : 20)}
      isDisabled={isDisabled}
      isLoading={isLoading}
      width={isFullWidth ? '100%' : undefined}
      type={type}
      tooltip={tooltip}
      onClick={onClick}
      data-testid={testId}
    />
  );
}

Button.displayName = 'Button';
