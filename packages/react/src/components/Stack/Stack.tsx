/**
 * Tecton Stack.
 *
 * Lays children out in one direction with an even gap between them. `gap` and
 * `padding` are steps on Tecton's 4px grid, not pixel values, so a layout
 * cannot drift off the rhythm.
 */
import type {ElementType, ReactNode} from 'react';
import {Stack as BaseStack} from '@astryxdesign/core/Stack';

/** A step on Tecton's 4px spacing grid. */
export type SpaceStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10;

/** How the children sit along an axis. */
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';

/** How the space along the main axis is shared out. */
export type StackJustify =
  'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps {
  /** The children to lay out. */
  children?: ReactNode;
  /**
   * Which way the children run.
   * @default 'vertical'
   */
  direction?: 'horizontal' | 'vertical';
  /** Space between the children, as a step on the spacing grid. */
  gap?: SpaceStep;
  /** Space inside the stack, as a step on the spacing grid. */
  padding?: SpaceStep;
  /** How the space along the main axis is shared out. */
  justify?: StackJustify;
  /** How the children sit across the other axis. */
  align?: StackAlign;
  /**
   * Whether the children wrap onto another line when they run out of room.
   * @default 'nowrap'
   */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** Width — a number is pixels, a string is used as-is. */
  width?: number | string;
  /** Height — a number is pixels, a string is used as-is. */
  height?: number | string;
  /** Maximum width — a number is pixels, a string is used as-is. */
  maxWidth?: number | string;
  /** Minimum height — a number is pixels, a string is used as-is. */
  minHeight?: number | string;
  /**
   * Lets the stack scroll when its children overflow.
   * @default false
   */
  isScrollable?: boolean;
  /**
   * Which element to render.
   * @default 'div'
   */
  as?: ElementType;
  /** Test hook. */
  'data-testid'?: string;
}

export function Stack({
  children,
  direction = 'vertical',
  gap,
  padding,
  justify,
  align,
  wrap = 'nowrap',
  width,
  height,
  maxWidth,
  minHeight,
  isScrollable = false,
  as = 'div',
  'data-testid': testId,
}: StackProps) {
  return (
    <BaseStack
      direction={direction}
      gap={gap}
      padding={padding}
      justify={justify}
      align={align}
      wrap={wrap}
      width={width}
      height={height}
      maxWidth={maxWidth}
      minHeight={minHeight}
      isScrollable={isScrollable}
      as={as}
      data-testid={testId}
    >
      {children}
    </BaseStack>
  );
}

Stack.displayName = 'Stack';
