/**
 * Tecton Button.
 *
 * A thin, intentional wrapper: the Tecton prop surface is declared here and
 * mapped onto the underlying implementation, so the two can diverge without a
 * breaking change for applications. A later phase fills in the real mapping
 * (tone/emphasis vocabulary, icon slots, pending state).
 */
import type {MouseEventHandler, ReactNode, Ref} from 'react';
import {Button as BaseButton} from '@astryxdesign/core/Button';

/** Visual emphasis of a button. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

/** Control height. */
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Accessible label, rendered as the visible button text. */
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
  /**
   * Prevents interaction and dims the control.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Shows a spinner in place of the icon while the action is in flight.
   * @default false
   */
  isLoading?: boolean;
  /** Icon element rendered before the label. */
  icon?: ReactNode;
  /**
   * HTML button type.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
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
  isDisabled = false,
  isLoading = false,
  icon,
  type = 'button',
  onClick,
  ref,
  'data-testid': testId,
}: ButtonProps) {
  return (
    <BaseButton
      ref={ref}
      label={label}
      variant={variant}
      size={size}
      isDisabled={isDisabled}
      isLoading={isLoading}
      icon={icon}
      type={type}
      onClick={onClick}
      data-testid={testId}
    />
  );
}

Button.displayName = 'Button';
