/**
 * Tecton ButtonGroup.
 *
 * Buttons joined into one control, for a set of actions that belong together.
 * The group sets the size for its children; each button keeps its own
 * emphasis.
 */
import type {ReactNode} from 'react';
import {ButtonGroup as BaseButtonGroup} from '@astryxdesign/core/ButtonGroup';
import type {ControlSize} from '../../types/field.js';

/** Which way the buttons run. */
export type ButtonGroupOrientation = 'horizontal' | 'vertical';

export interface ButtonGroupProps {
  /** The buttons in the group. */
  children: ReactNode;
  /** Accessible name for the group. */
  label: string;
  /**
   * Which way the buttons run.
   * @default 'horizontal'
   */
  orientation?: ButtonGroupOrientation;
  /**
   * Control height for every button in the group.
   * @default 'md'
   */
  size?: ControlSize;
  /**
   * Disables every button in the group.
   * @default false
   */
  isDisabled?: boolean;
  /** Test hook. */
  'data-testid'?: string;
}

export function ButtonGroup({
  children,
  label,
  orientation = 'horizontal',
  size = 'md',
  isDisabled = false,
  'data-testid': testId,
}: ButtonGroupProps) {
  return (
    <BaseButtonGroup
      label={label}
      orientation={orientation}
      size={size}
      isDisabled={isDisabled}
      data-testid={testId}
    >
      {children}
    </BaseButtonGroup>
  );
}

ButtonGroup.displayName = 'ButtonGroup';
