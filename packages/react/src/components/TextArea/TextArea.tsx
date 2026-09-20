/**
 * Tecton TextArea.
 *
 * Several lines of text, in the same outlined appearance as `TextField`. Size
 * it with `rows` — the control grows with the content it is given room for,
 * not with the `size` prop, which only sets the padding.
 */
import type {Ref} from 'react';
import {TextArea as BaseTextArea} from '@astryxdesign/core/TextArea';
import {resolveIcon, type TectonIconRef} from '../../icons/renderIcon.js';
import type {ControlSize, FieldStatus} from '../../types/field.js';

export interface TextAreaProps {
  /** Label shown above the field; always rendered for assistive technology. */
  label: string;
  /** The field's current value. */
  value: string;
  /** Called with the new value on every keystroke. */
  onChange?: (value: string) => void;
  /**
   * How many lines of text are visible.
   * @default 3
   */
  rows?: number;
  /**
   * Padding inside the field.
   * @default 'md'
   */
  size?: ControlSize;
  /** Ghost text shown while the field is empty. */
  placeholder?: string;
  /** Helper text shown under the field. */
  description?: string;
  /** Glyph rendered inside the leading edge of the field. */
  startIcon?: TectonIconRef;
  /** Validation feedback; an error also sets `aria-invalid`. */
  status?: FieldStatus;
  /**
   * Largest number of characters the field expects. Shows a counter, and turns
   * it red once the text runs past.
   */
  maxLength?: number;
  /**
   * Visually hides the label, keeping it for assistive technology.
   * @default false
   */
  isLabelHidden?: boolean;
  /**
   * Prevents interaction and dims the field.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Shows the value at full strength but blocks editing.
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * Marks the field required and sets `aria-required`.
   * @default false
   */
  isRequired?: boolean;
  /** HTML name, for a field that submits with a form. */
  name?: string;
  /** Width of the whole field — a number is pixels, a string is used as-is. */
  width?: number | string;
  /** Ref forwarded to the underlying textarea element. */
  ref?: Ref<HTMLTextAreaElement>;
  /** Test hook. */
  'data-testid'?: string;
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  size = 'md',
  placeholder,
  description,
  startIcon,
  status,
  maxLength,
  isLabelHidden = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  name,
  width,
  ref,
  'data-testid': testId,
}: TextAreaProps) {
  return (
    <BaseTextArea
      ref={ref}
      label={label}
      value={value}
      onChange={onChange}
      rows={rows}
      size={size}
      placeholder={placeholder}
      description={description}
      startIcon={resolveIcon(startIcon)}
      status={status}
      // Tecton draws a validation message as plain coloured helper text under
      // the field, which is the detached treatment.
      statusVariant="detached"
      maxLength={maxLength}
      isLabelHidden={isLabelHidden}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      htmlName={name}
      width={width}
      data-testid={testId}
    />
  );
}

TextArea.displayName = 'TextArea';
