/**
 * Tecton Checkbox.
 *
 * One independent choice: on, off, or — when it summarises a set of choices
 * below it — indeterminate. Tecton draws the checked box as a bright chip with
 * a dark tick rather than an accent fill.
 */
import type {Ref} from 'react';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import type {ControlSize, FieldStatus} from '../../types/field.js';

/** Checked, unchecked, or standing for a partly-checked set. */
export type CheckboxValue = boolean | 'indeterminate';

export interface CheckboxProps {
  /** Label next to the box; always rendered for assistive technology. */
  label: string;
  /** Whether the box is checked, unchecked or indeterminate. */
  value: CheckboxValue;
  /** Called with the new checked state when the box is toggled. */
  onChange?: (isChecked: boolean) => void;
  /**
   * Box size: `md` is 16px, `sm` is 12px.
   * @default 'md'
   */
  size?: ControlSize;
  /** Helper text under the label. */
  description?: string;
  /** Validation feedback; an error also sets `aria-invalid`. */
  status?: FieldStatus & {message: string};
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
  /**
   * Shows the state at full strength but blocks toggling.
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * Marks the choice required.
   * @default false
   */
  isRequired?: boolean;
  /** HTML name, for a checkbox that submits with a form. */
  name?: string;
  /** Ref forwarded to the underlying input element. */
  ref?: Ref<HTMLInputElement>;
  /** Test hook. */
  'data-testid'?: string;
}

export function Checkbox({
  label,
  value,
  onChange,
  size = 'md',
  description,
  status,
  isLabelHidden = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  name,
  ref,
  'data-testid': testId,
}: CheckboxProps) {
  return (
    <CheckboxInput
      ref={ref}
      label={label}
      value={value}
      onChange={onChange}
      size={size}
      description={description}
      status={status}
      isLabelHidden={isLabelHidden}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      htmlName={name}
      data-testid={testId}
    />
  );
}

Checkbox.displayName = 'Checkbox';
