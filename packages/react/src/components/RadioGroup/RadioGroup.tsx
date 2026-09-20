/**
 * Tecton RadioGroup.
 *
 * A labelled set of mutually exclusive options. Exactly one is chosen at a
 * time; if the question can be left unanswered, give it an explicit "none"
 * option rather than starting with no value.
 */
import type {ReactNode} from 'react';
import {RadioList} from '@astryxdesign/core/RadioList';
import type {ControlSize, FieldStatus} from '../../types/field.js';

/** Which way the options run. */
export type RadioGroupOrientation = 'vertical' | 'horizontal';

export interface RadioGroupProps {
  /** Label for the whole set; always rendered for assistive technology. */
  label: string;
  /** The `Radio` options. */
  children: ReactNode;
  /** The value of the chosen option. */
  value: string;
  /** Called with the value of the option the user chose. */
  onChange: (value: string) => void;
  /** Helper text under the group label. */
  description?: string;
  /**
   * Which way the options run.
   * @default 'vertical'
   */
  orientation?: RadioGroupOrientation;
  /**
   * Control size: `md` is 16px, `sm` is 13px.
   * @default 'md'
   */
  size?: ControlSize;
  /**
   * Visually hides the group label, keeping it for assistive technology.
   * @default false
   */
  isLabelHidden?: boolean;
  /**
   * Disables every option in the group.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Marks the question required.
   * @default false
   */
  isRequired?: boolean;
  /** Validation feedback for the group. */
  status?: FieldStatus;
  /** HTML name shared by the options, for a group that submits with a form. */
  name?: string;
  /** Test hook. */
  'data-testid'?: string;
}

export function RadioGroup({
  label,
  children,
  value,
  onChange,
  description,
  orientation = 'vertical',
  size = 'md',
  isLabelHidden = false,
  isDisabled = false,
  isRequired = false,
  status,
  name,
  'data-testid': testId,
}: RadioGroupProps) {
  return (
    <RadioList
      label={label}
      value={value}
      onChange={onChange}
      description={description}
      orientation={orientation}
      size={size}
      isLabelHidden={isLabelHidden}
      isDisabled={isDisabled}
      isRequired={isRequired}
      status={status}
      htmlName={name}
      data-testid={testId}
    >
      {children}
    </RadioList>
  );
}

RadioGroup.displayName = 'RadioGroup';
