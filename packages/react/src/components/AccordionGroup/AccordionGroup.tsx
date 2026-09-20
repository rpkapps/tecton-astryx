/**
 * Tecton AccordionGroup.
 *
 * Coordinates a stack of accordions: `single` closes the open one when another
 * opens, `multiple` lets any number stand open. Every accordion inside needs a
 * `value` so the group can tell them apart.
 */
import type {ReactNode} from 'react';
import {CollapsibleGroup} from '@astryxdesign/core/Collapsible';

/** How many accordions may stand open at once. */
export type AccordionGroupType = 'single' | 'multiple';

/** How much air each accordion's header and body get. */
export type AccordionGroupDensity = 'compact' | 'balanced' | 'spacious';

export interface AccordionGroupProps {
  /** The accordions to coordinate. */
  children: ReactNode;
  /**
   * How many accordions may stand open at once.
   * @default 'single'
   */
  type?: AccordionGroupType;
  /** Which accordions are open, when the group is controlled. */
  value?: string | string[];
  /** Which accordions start open, when the group is uncontrolled. */
  defaultValue?: string | string[];
  /** Called with the open accordions whenever they change. */
  onChange?: (value: string | string[]) => void;
  /**
   * Draws a hairline between the accordions.
   * @default false
   */
  hasDividers?: boolean;
  /** How much air each accordion's header and body get. */
  density?: AccordionGroupDensity;
  /**
   * Which end of each header the disclosure chevron sits at.
   * @default 'end'
   */
  chevronPosition?: 'start' | 'end';
  /** Test hook. */
  'data-testid'?: string;
}

export function AccordionGroup({
  children,
  type = 'single',
  value,
  defaultValue,
  onChange,
  hasDividers = false,
  density,
  chevronPosition = 'end',
  'data-testid': testId,
}: AccordionGroupProps) {
  return (
    <CollapsibleGroup
      type={type}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      hasDividers={hasDividers}
      density={density}
      chevronPosition={chevronPosition}
      data-testid={testId}
    >
      {children}
    </CollapsibleGroup>
  );
}

AccordionGroup.displayName = 'AccordionGroup';
