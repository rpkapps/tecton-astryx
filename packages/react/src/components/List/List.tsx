/**
 * Tecton List.
 *
 * A vertical run of rows that belong to one collection. `density` sets the row
 * height: Tecton draws the default row at 44px and the condensed one at 36px.
 */
import type {ReactNode} from 'react';
import {List as BaseList} from '@astryxdesign/core/List';

/** Row height. */
export type ListDensity = 'condensed' | 'default' | 'comfortable';

/** How the rows are marked. `decimal` numbers them and renders an `<ol>`. */
export type ListMarker = 'none' | 'disc' | 'circle' | 'decimal';

const DENSITY = {
  condensed: 'compact',
  default: 'balanced',
  comfortable: 'spacious',
} as const satisfies Record<ListDensity, string>;

export interface ListProps {
  /** The rows. */
  children?: ReactNode;
  /**
   * Row height.
   * @default 'default'
   */
  density?: ListDensity;
  /**
   * Draws a hairline between the rows.
   * @default false
   */
  hasDividers?: boolean;
  /** A heading above the list, which also names it for assistive technology. */
  header?: ReactNode;
  /**
   * How the rows are marked.
   * @default 'none'
   */
  marker?: ListMarker;
  /**
   * The number a `decimal` list counts from.
   * @default 1
   */
  start?: number;
  /** Test hook. */
  'data-testid'?: string;
}

export function List({
  children,
  density = 'default',
  hasDividers = false,
  header,
  marker = 'none',
  start = 1,
  'data-testid': testId,
}: ListProps) {
  return (
    <BaseList
      density={DENSITY[density]}
      hasDividers={hasDividers}
      header={header}
      listStyle={marker}
      start={start}
      data-testid={testId}
    >
      {children}
    </BaseList>
  );
}

List.displayName = 'List';
