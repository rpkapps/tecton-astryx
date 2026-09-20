/**
 * Tecton Select.
 *
 * Picks one value from a known list. Below about half a dozen options a radio
 * group is easier to scan; above about twenty, turn on `hasSearch`.
 *
 * Options are data, not children, so a Tecton select never needs anything
 * imported alongside it.
 */
import {Selector} from '@astryxdesign/core/Selector';
import {resolveIcon, type TectonIconRef} from '../../icons/renderIcon.js';
import type {ControlSize, FieldStatus} from '../../types/field.js';

/** The field's appearance. */
export type SelectAppearance = 'outlined' | 'textOnly';

/** One choosable value. */
export interface SelectOption {
  /** The value this option sets. */
  value: string;
  /** What the option is called. */
  label: string;
  /** Helper text under the label. */
  description?: string;
  /** Glyph rendered before the label, by name or as an SVG component. */
  icon?: TectonIconRef;
  /**
   * Prevents the option from being chosen.
   * @default false
   */
  isDisabled?: boolean;
}

/** A titled run of options. */
export interface SelectSection {
  type: 'section';
  /** The heading shown above the run. */
  title?: string;
  /** The options in the run. */
  options: readonly SelectOption[];
}

/** A rule between two runs of options. */
export interface SelectDivider {
  type: 'divider';
}

/** Anything that can appear in a select's list. */
export type SelectItem = SelectOption | SelectSection | SelectDivider;

function toOption(option: SelectOption) {
  return {
    value: option.value,
    label: option.label,
    description: option.description,
    icon: resolveIcon(option.icon),
    disabled: option.isDisabled,
  };
}

function toItem(item: SelectItem) {
  if ('type' in item) {
    return item.type === 'divider'
      ? {type: 'divider' as const}
      : {
          type: 'section' as const,
          title: item.title,
          options: item.options.map(toOption),
        };
  }
  return toOption(item);
}

export interface SelectProps {
  /** Label shown above the field; always rendered for assistive technology. */
  label: string;
  /** The options, sections and dividers to choose from. */
  options: readonly SelectItem[];
  /** The value of the chosen option. */
  value?: string;
  /**
   * Called with the value the user chose. With `hasClear`, clearing the field
   * reports an empty string.
   */
  onChange?: (value: string) => void;
  /**
   * Control height.
   * @default 'md'
   */
  size?: ControlSize;
  /**
   * The field's appearance: `outlined` for a form, `textOnly` for a select
   * that reads as part of a sentence or a toolbar.
   * @default 'outlined'
   */
  appearance?: SelectAppearance;
  /**
   * Text shown while nothing is chosen.
   * @default 'Select...'
   */
  placeholder?: string;
  /** Helper text shown under the field. */
  description?: string;
  /** Glyph rendered inside the leading edge of the field. */
  startIcon?: TectonIconRef;
  /** Validation feedback; an error also sets `aria-invalid`. */
  status?: FieldStatus;
  /**
   * Adds a search box above the options.
   * @default false
   */
  hasSearch?: boolean;
  /**
   * Adds a clear button once a value is chosen.
   * @default false
   */
  hasClear?: boolean;
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
   * Marks the field required.
   * @default false
   */
  isRequired?: boolean;
  /** HTML name, for a field that submits with a form. */
  name?: string;
  /** Width of the whole field — a number is pixels, a string is used as-is. */
  width?: number | string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  size = 'md',
  appearance = 'outlined',
  placeholder = 'Select...',
  description,
  startIcon,
  status,
  hasSearch = false,
  hasClear = false,
  isLabelHidden = false,
  isDisabled = false,
  isRequired = false,
  name,
  width,
  'data-testid': testId,
}: SelectProps) {
  const common = {
    label,
    options: options.map(toItem),
    size,
    variant:
      appearance === 'textOnly' ? ('ghost' as const) : ('input' as const),
    placeholder,
    description,
    startIcon: resolveIcon(startIcon),
    status,
    statusVariant: 'detached' as const,
    hasSearch,
    isLabelHidden,
    isDisabled,
    isRequired,
    htmlName: name,
    width,
    'data-testid': testId,
  };

  // A clearable selector reports `null` underneath; Tecton keeps one callback
  // signature and reports the empty string instead.
  return hasClear ? (
    <Selector
      {...common}
      hasClear
      value={value ?? null}
      onChange={next => onChange?.(next ?? '')}
    />
  ) : (
    <Selector {...common} value={value} onChange={onChange} />
  );
}

Select.displayName = 'Select';
