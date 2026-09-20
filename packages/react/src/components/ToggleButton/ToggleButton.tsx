/**
 * Tecton ToggleButton.
 *
 * A button that stays down: a setting that is on, a layer that is shown, a
 * panel that is open. It carries the "activated" look the rest of Tecton's
 * buttons only pass through on the way to a click.
 */
import {ToggleButton as BaseToggleButton} from '@astryxdesign/core/ToggleButton';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';

/** Control height. */
export type ToggleButtonSize = 'extraSmall' | 'small' | 'medium' | 'large';

const SIZE = {
  extraSmall: 'sm',
  small: 'sm',
  medium: 'md',
  large: 'lg',
} as const satisfies Record<ToggleButtonSize, string>;

export interface ToggleButtonProps {
  /**
   * What the button turns on. Visible text, or the accessible name when the
   * button is icon-only.
   */
  label: string;
  /** Whether the button is down. Ignored inside a `ToggleButtonGroup`. */
  isPressed?: boolean;
  /** Called with the new state. Ignored inside a `ToggleButtonGroup`. */
  onPressedChange?: (isPressed: boolean) => void;
  /** Glyph shown while the button is up, by name or as an SVG component. */
  icon?: TectonIconRef;
  /** Glyph shown while the button is down. Falls back to `icon`. */
  pressedIcon?: TectonIconRef;
  /**
   * Drops the visible text and uses `label` as the accessible name and the
   * tooltip. Needs `icon`.
   * @default false
   */
  isIconOnly?: boolean;
  /**
   * Control height.
   * @default 'medium'
   */
  size?: ToggleButtonSize;
  /**
   * Prevents interaction and recesses the fill.
   * @default false
   */
  isDisabled?: boolean;
  /** The value this button contributes inside a `ToggleButtonGroup`. */
  value?: string;
  /** Test hook. */
  'data-testid'?: string;
}

export function ToggleButton({
  label,
  isPressed,
  onPressedChange,
  icon,
  pressedIcon,
  isIconOnly = false,
  size = 'medium',
  isDisabled = false,
  value,
  'data-testid': testId,
}: ToggleButtonProps) {
  return (
    <BaseToggleButton
      label={label}
      isPressed={isPressed}
      onPressedChange={next => onPressedChange?.(next)}
      icon={renderIcon(icon, 16)}
      pressedIcon={renderIcon(pressedIcon, 16)}
      isIconOnly={isIconOnly}
      size={SIZE[size]}
      isDisabled={isDisabled}
      value={value}
      data-testid={testId}
    />
  );
}

ToggleButton.displayName = 'ToggleButton';
