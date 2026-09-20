/**
 * Tecton Slider.
 *
 * Picks a number, or a range of two, by position rather than by typing. Give
 * it a `formatValue` whenever the number means something — depths, pressures,
 * percentages — so the value is announced in the units the person reads.
 */
import {Slider as BaseSlider} from '@astryxdesign/core/Slider';
import type {FieldStatus} from '../../types/field.js';

/** A single value, or the two ends of a range. */
export type SliderValue = number | [number, number];

/** How the current value is shown. */
export type SliderValueDisplay = 'tooltip' | 'text' | 'none';

/** A labelled tick on the track. */
export interface SliderMark {
  /** Where the tick sits, on the slider's own scale. */
  value: number;
  /** What the tick is called. */
  label?: string;
}

export interface SliderProps {
  /** Label above the track; always rendered for assistive technology. */
  label: string;
  /** The current value: one number, or the two ends of a range. */
  value: SliderValue;
  /** Called continuously as the thumb moves. */
  onChange?: (value: SliderValue) => void;
  /** Called once, when the drag ends. */
  onChangeEnd?: (value: SliderValue) => void;
  /**
   * Lowest value.
   * @default 0
   */
  min?: number;
  /**
   * Highest value.
   * @default 100
   */
  max?: number;
  /**
   * How far one step moves the value.
   * @default 1
   */
  step?: number;
  /** Ticks drawn on the track. */
  marks?: readonly SliderMark[];
  /** Formats the value for display and for assistive technology. */
  formatValue?: (value: number) => string;
  /**
   * How the current value is shown.
   * @default 'tooltip'
   */
  valueDisplay?: SliderValueDisplay;
  /**
   * Which way the track runs.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /** Helper text under the label. */
  description?: string;
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
  /** Validation feedback for the value. */
  status?: FieldStatus;
  /** Width of the whole field — a number is pixels, a string is used as-is. */
  width?: number | string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Slider({
  label,
  value,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  marks,
  formatValue,
  valueDisplay = 'tooltip',
  orientation = 'horizontal',
  description,
  isLabelHidden = false,
  isDisabled = false,
  status,
  width,
  'data-testid': testId,
}: SliderProps) {
  const common = {
    label,
    min,
    max,
    step,
    marks: marks === undefined ? undefined : [...marks],
    formatValue,
    valueDisplay,
    orientation,
    description,
    isLabelHidden,
    isDisabled,
    status,
    width,
    'data-testid': testId,
  };

  // The control underneath splits single-value and range sliders into two prop
  // shapes; Tecton keeps one component and picks the shape from the value.
  return Array.isArray(value) ? (
    <BaseSlider
      {...common}
      value={value}
      onChange={onChange as (value: [number, number]) => void}
      onChangeEnd={onChangeEnd as (value: [number, number]) => void}
    />
  ) : (
    <BaseSlider
      {...common}
      value={value}
      onChange={onChange as (value: number) => void}
      onChangeEnd={onChangeEnd as (value: number) => void}
    />
  );
}

Slider.displayName = 'Slider';
