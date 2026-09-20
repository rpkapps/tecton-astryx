/**
 * Tecton ToggleButtonGroup.
 *
 * A row of segments of which exactly one is chosen — a view switch, a unit, a
 * density. The segments are data, so the group never needs anything imported
 * alongside it.
 */
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';
import type {ToggleButtonSize} from '../ToggleButton/ToggleButton.js';

/** How the segments share the width of the group. */
export type ToggleButtonGroupLayout = 'hug' | 'fill';

/** One segment. */
export interface ToggleButtonGroupItem {
  /** The value this segment sets on the group. */
  value: string;
  /** What the segment is called. */
  label: string;
  /** Glyph before the label, by name or as an SVG component. */
  icon?: TectonIconRef;
  /**
   * Drops the visible text, using the label as the accessible name.
   * @default false
   */
  isLabelHidden?: boolean;
  /**
   * Prevents this segment from being chosen.
   * @default false
   */
  isDisabled?: boolean;
}

const SIZE = {
  extraSmall: 'sm',
  small: 'sm',
  medium: 'md',
  large: 'lg',
} as const satisfies Record<ToggleButtonSize, string>;

export interface ToggleButtonGroupProps {
  /** Accessible name for the group. */
  label: string;
  /** The segments, in the order they are shown. */
  items: readonly ToggleButtonGroupItem[];
  /** The value of the chosen segment. */
  value: string;
  /** Called with the value of the segment the user chose. */
  onChange: (value: string) => void;
  /**
   * Control height.
   * @default 'medium'
   */
  size?: ToggleButtonSize;
  /**
   * How the segments share the width of the group: `hug` sizes each to its
   * label, `fill` stretches them equally.
   * @default 'hug'
   */
  layout?: ToggleButtonGroupLayout;
  /**
   * Disables every segment in the group.
   * @default false
   */
  isDisabled?: boolean;
  /** Test hook. */
  'data-testid'?: string;
}

export function ToggleButtonGroup({
  label,
  items,
  value,
  onChange,
  size = 'medium',
  layout = 'hug',
  isDisabled = false,
  'data-testid': testId,
}: ToggleButtonGroupProps) {
  return (
    <SegmentedControl
      label={label}
      value={value}
      onChange={onChange}
      size={SIZE[size]}
      layout={layout}
      isDisabled={isDisabled}
      data-testid={testId}
    >
      {items.map(item => (
        <SegmentedControlItem
          key={item.value}
          value={item.value}
          label={item.label}
          icon={renderIcon(item.icon, 16)}
          isLabelHidden={item.isLabelHidden}
          isDisabled={item.isDisabled}
        />
      ))}
    </SegmentedControl>
  );
}

ToggleButtonGroup.displayName = 'ToggleButtonGroup';
