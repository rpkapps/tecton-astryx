/**
 * Tecton Radio.
 *
 * One option inside a `RadioGroup`. Tecton draws the selected dot in a light
 * neutral rather than an accent colour.
 */
import type {ReactNode} from 'react';
import {RadioListItem} from '@astryxdesign/core/RadioList';

export interface RadioProps {
  /** The option's label. */
  label: ReactNode;
  /** The value this option sets on the group. */
  value: string;
  /** Helper text under the label. */
  description?: ReactNode;
  /**
   * Prevents this option from being chosen.
   * @default false
   */
  isDisabled?: boolean;
  /** Content rendered before the radio circle. */
  startContent?: ReactNode;
  /** Content rendered after the label. */
  endContent?: ReactNode;
  /** Test hook. */
  'data-testid'?: string;
}

export function Radio({
  label,
  value,
  description,
  isDisabled = false,
  startContent,
  endContent,
  'data-testid': testId,
}: RadioProps) {
  return (
    <RadioListItem
      label={label}
      value={value}
      description={description}
      isDisabled={isDisabled}
      startContent={startContent}
      endContent={endContent}
      data-testid={testId}
    />
  );
}

Radio.displayName = 'Radio';
