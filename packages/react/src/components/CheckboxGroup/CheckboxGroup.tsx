/**
 * Tecton CheckboxGroup.
 *
 * A labelled set of checkboxes that share one value: an array of the keys that
 * are checked. Use it whenever the choices belong to one question — the group
 * label is what assistive technology announces for the whole set.
 */
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import type {FieldStatus} from '../../types/field.js';

/** How much air each row gets. */
export type CheckboxGroupDensity = 'compact' | 'balanced' | 'spacious';

/** One choice in a `CheckboxGroup`. */
export interface CheckboxGroupItem {
  /** The key this choice contributes to the group's value. */
  value: string;
  /** The row's label. */
  label: string;
  /** Helper text under the label. */
  description?: string;
  /**
   * Prevents this row from being toggled.
   * @default false
   */
  isDisabled?: boolean;
}

export interface CheckboxGroupProps {
  /** Label for the whole set; always rendered for assistive technology. */
  label: string;
  /** The choices, in the order they are shown. */
  items: readonly CheckboxGroupItem[];
  /** The keys that are currently checked. */
  value: readonly string[];
  /** Called with the new set of checked keys. */
  onChange?: (value: string[]) => void;
  /** Helper text under the group label. */
  description?: string;
  /**
   * How much air each row gets.
   * @default 'balanced'
   */
  density?: CheckboxGroupDensity;
  /**
   * Draws a hairline between the rows.
   * @default false
   */
  hasDividers?: boolean;
  /**
   * Visually hides the group label, keeping it for assistive technology.
   * @default false
   */
  isLabelHidden?: boolean;
  /**
   * Disables every row in the group.
   * @default false
   */
  isDisabled?: boolean;
  /** Validation feedback for the group. */
  status?: FieldStatus;
  /** Test hook. */
  'data-testid'?: string;
}

export function CheckboxGroup({
  label,
  items,
  value,
  onChange,
  description,
  density = 'balanced',
  hasDividers = false,
  isLabelHidden = false,
  isDisabled = false,
  status,
  'data-testid': testId,
}: CheckboxGroupProps) {
  return (
    <CheckboxList
      label={label}
      value={[...value]}
      onChange={onChange}
      description={description}
      density={density}
      hasDividers={hasDividers}
      isLabelHidden={isLabelHidden}
      isDisabled={isDisabled}
      status={status}
      data-testid={testId}
    >
      {items.map(item => (
        <CheckboxListItem
          key={item.value}
          value={item.value}
          label={item.label}
          description={item.description}
          isDisabled={item.isDisabled}
        />
      ))}
    </CheckboxList>
  );
}

CheckboxGroup.displayName = 'CheckboxGroup';
