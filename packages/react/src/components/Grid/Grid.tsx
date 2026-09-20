/**
 * Tecton Grid.
 *
 * Lays children out in columns. Give `columns` a number for a fixed count, or
 * a minimum column width to let the grid decide how many fit.
 */
import type {ReactNode} from 'react';
import {Grid as BaseGrid} from '@astryxdesign/core/Grid';
import type {SpaceStep} from '../Stack/Stack.js';

/**
 * How many columns the grid has: a fixed number, or a rule that fits as many
 * columns of at least `minWidth` as the space allows.
 */
export type GridColumns =
  | number
  | {
      /** Smallest a column may be, in pixels. */
      minWidth: number;
      /** Largest number of columns to make. */
      max?: number;
      /**
       * What happens to the tracks nothing lands in: `fill` keeps them so the
       * columns stay the same width, `fit` collapses them so the children
       * stretch.
       * @default 'fill'
       */
      repeat?: 'fill' | 'fit';
    };

export interface GridProps {
  /** The children to lay out. */
  children?: ReactNode;
  /** How many columns the grid has. */
  columns?: GridColumns;
  /** Space between the children, as a step on the spacing grid. */
  gap?: SpaceStep;
  /** Space between the rows, overriding `gap` on that axis. */
  rowGap?: SpaceStep;
  /** Space between the columns, overriding `gap` on that axis. */
  columnGap?: SpaceStep;
  /**
   * How the children sit within their row.
   * @default 'stretch'
   */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /**
   * How the children sit within their column.
   * @default 'stretch'
   */
  justify?: 'start' | 'center' | 'end' | 'stretch';
  /** Width — a number is pixels, a string is used as-is. */
  width?: number | string;
  /** Maximum width — a number is pixels, a string is used as-is. */
  maxWidth?: number | string;
  /** Minimum height — a number is pixels, a string is used as-is. */
  minHeight?: number | string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Grid({
  children,
  columns,
  gap,
  rowGap,
  columnGap,
  align = 'stretch',
  justify = 'stretch',
  width,
  maxWidth,
  minHeight,
  'data-testid': testId,
}: GridProps) {
  return (
    <BaseGrid
      columns={columns}
      gap={gap}
      rowGap={rowGap}
      columnGap={columnGap}
      align={align}
      justify={justify}
      width={width}
      maxWidth={maxWidth}
      minHeight={minHeight}
      data-testid={testId}
    >
      {children}
    </BaseGrid>
  );
}

Grid.displayName = 'Grid';
