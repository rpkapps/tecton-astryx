/**
 * Tecton Switch.
 *
 * An immediate on/off setting — it takes effect the moment it is flipped, with
 * no separate save. If the change needs confirming, use a checkbox instead.
 */
import type {Ref} from 'react';
import {Switch as BaseSwitch} from '@astryxdesign/core/Switch';
import type {ControlSize, FieldStatus} from '../../types/field.js';

/** Which side of the switch the label sits on. */
export type SwitchLabelPosition = 'start' | 'end';

export interface SwitchProps {
  /** Label next to the switch; always rendered for assistive technology. */
  label: string;
  /** Whether the switch is on. */
  value: boolean;
  /** Called with the new state when the switch is flipped. */
  onChange?: (isOn: boolean) => void;
  /**
   * Control size.
   * @default 'md'
   */
  size?: ControlSize;
  /** Helper text under the label. */
  description?: string;
  /**
   * Which side of the switch the label sits on.
   * @default 'end'
   */
  labelPosition?: SwitchLabelPosition;
  /**
   * Visually hides the label, keeping it for assistive technology.
   * @default false
   */
  isLabelHidden?: boolean;
  /**
   * Prevents interaction and dims the control.
   * @default false
   */
  isDisabled?: boolean;
  /** Validation feedback for the setting. */
  status?: FieldStatus;
  /** HTML name, for a switch that submits with a form. */
  name?: string;
  /** Ref forwarded to the underlying input element. */
  ref?: Ref<HTMLInputElement>;
  /** Test hook. */
  'data-testid'?: string;
}

export function Switch({
  label,
  value,
  onChange,
  size = 'md',
  description,
  labelPosition = 'end',
  isLabelHidden = false,
  isDisabled = false,
  status,
  name,
  ref,
  'data-testid': testId,
}: SwitchProps) {
  return (
    <BaseSwitch
      ref={ref}
      label={label}
      value={value}
      onChange={onChange}
      size={size}
      description={description}
      labelPosition={labelPosition}
      isLabelHidden={isLabelHidden}
      isDisabled={isDisabled}
      status={status}
      htmlName={name}
      data-testid={testId}
    />
  );
}

Switch.displayName = 'Switch';
