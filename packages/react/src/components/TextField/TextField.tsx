/**
 * Tecton TextField.
 *
 * One line of text, in the outlined appearance: a transparent field inside a
 * 1px rule, a label above it and helper text below. The design's filled and
 * text-only appearances are not part of Tecton's API — see the component's
 * documentation for why.
 *
 * Validation is drawn the way the design draws it: the message is plain
 * coloured helper text under the field, not a boxed callout.
 */
import type {Ref} from 'react';
import {TextInput} from '@astryxdesign/core/TextInput';
import {resolveIcon, type TectonIconRef} from '../../icons/renderIcon.js';
import type {ControlSize, FieldStatus} from '../../types/field.js';

/** Control height: `md` is 32px, `sm` is 28px. */
export type TextFieldSize = ControlSize;

/** What the field holds, which sets the keyboard and the masking. */
export type TextFieldType = 'text' | 'password' | 'email';

export interface TextFieldProps {
  /** Label shown above the field; always rendered for assistive technology. */
  label: string;
  /** The field's current value. */
  value: string;
  /** Called with the new value on every keystroke. */
  onChange?: (value: string) => void;
  /**
   * What the field holds.
   * @default 'text'
   */
  type?: TextFieldType;
  /**
   * Control height.
   * @default 'md'
   */
  size?: TextFieldSize;
  /** Ghost text shown while the field is empty. */
  placeholder?: string;
  /** Helper text shown under the field. */
  description?: string;
  /** Glyph rendered inside the leading edge of the field. */
  startIcon?: TectonIconRef;
  /** Validation feedback; an error also sets `aria-invalid`. */
  status?: FieldStatus;
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
   * Shows the value at full strength but blocks editing, keeping the field in
   * the tab order.
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * Marks the field required and sets `aria-required`.
   * @default false
   */
  isRequired?: boolean;
  /**
   * Marks the field optional.
   * @default false
   */
  isOptional?: boolean;
  /**
   * Shows a clear button once the field has a value.
   * @default false
   */
  hasClear?: boolean;
  /** Called when the user presses Enter. */
  onEnter?: () => void;
  /** HTML name, for a field that submits with a form. */
  name?: string;
  /** Width of the whole field — a number is pixels, a string is used as-is. */
  width?: number | string;
  /** Ref forwarded to the underlying input element. */
  ref?: Ref<HTMLInputElement>;
  /** Test hook. */
  'data-testid'?: string;
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  size = 'md',
  placeholder,
  description,
  startIcon,
  status,
  isLabelHidden = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  isOptional = false,
  hasClear = false,
  onEnter,
  name,
  width,
  ref,
  'data-testid': testId,
}: TextFieldProps) {
  return (
    <TextInput
      ref={ref}
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      size={size}
      placeholder={placeholder}
      description={description}
      startIcon={resolveIcon(startIcon)}
      status={status}
      // Tecton draws a validation message as plain coloured helper text under
      // the field, which is the detached treatment — never the bordered box.
      statusVariant="detached"
      isLabelHidden={isLabelHidden}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      isOptional={isOptional}
      hasClear={hasClear}
      onEnter={onEnter}
      htmlName={name}
      width={width}
      data-testid={testId}
    />
  );
}

TextField.displayName = 'TextField';
