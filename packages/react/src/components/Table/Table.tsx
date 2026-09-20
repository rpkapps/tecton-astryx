/**
 * Tecton Table.
 *
 * Rows of records with one column per field. Columns are data, and a column
 * can render its own cell, which is how a Tecton table gets its monospace
 * numbers, its status chips and its row actions.
 *
 * Tecton draws two densities: `md` rows at about 44px and `sm` rows at about
 * 34px.
 */
import type {ReactNode} from 'react';
import {
  Table as BaseTable,
  pixel,
  proportional,
} from '@astryxdesign/core/Table';
import type {ControlSize} from '../../types/field.js';

/** How a column's cells line up. */
export type TableColumnAlign = 'start' | 'center' | 'end';

/**
 * A column's width: a number of pixels, or a share of the space left over
 * (`{share: 2}` takes twice as much as `{share: 1}`).
 */
export type TableColumnWidth = number | {share: number; minWidth?: number};

/** Which rules are drawn between cells. */
export type TableDividers = 'rows' | 'columns' | 'grid' | 'none';

/** One column of a table. */
export interface TableColumn<Row> {
  /** Which field of the row this column shows. */
  key: Extract<keyof Row, string>;
  /** The column heading. */
  header: string;
  /** The column's width. */
  width?: TableColumnWidth;
  /** How the column's cells line up. */
  align?: TableColumnAlign;
  /** Renders the cell, instead of printing the field as text. */
  renderCell?: (row: Row) => ReactNode;
}

function toWidth(width: TableColumnWidth | undefined) {
  if (width === undefined) return undefined;
  return typeof width === 'number'
    ? pixel(width)
    : proportional(
        width.share,
        width.minWidth === undefined ? undefined : {minWidth: width.minWidth},
      );
}

export interface TableProps<Row extends Record<string, unknown>> {
  /** The rows. */
  data: readonly Row[];
  /** The columns. Omit them and one is made per field of the first row. */
  columns?: readonly TableColumn<Row>[];
  /** Which field identifies a row, or a function that returns its key. */
  idKey?: Extract<keyof Row, string> | ((row: Row) => string | number);
  /**
   * Row height.
   * @default 'md'
   */
  density?: ControlSize;
  /**
   * Which rules are drawn between cells.
   * @default 'rows'
   */
  dividers?: TableDividers;
  /**
   * Bands every other row.
   * @default false
   */
  isStriped?: boolean;
  /**
   * Highlights the row under the pointer.
   * @default false
   */
  hasHover?: boolean;
  /**
   * What a cell does with text too wide for its column.
   * @default 'wrap'
   */
  textOverflow?: 'wrap' | 'truncate';
  /**
   * Where cell content sits in a row taller than itself.
   * @default 'middle'
   */
  verticalAlign?: 'middle' | 'top' | 'bottom';
  /** Test hook. */
  'data-testid'?: string;
}

export function Table<Row extends Record<string, unknown>>({
  data,
  columns,
  idKey,
  density = 'md',
  dividers = 'rows',
  isStriped = false,
  hasHover = false,
  textOverflow = 'wrap',
  verticalAlign = 'middle',
  'data-testid': testId,
}: TableProps<Row>) {
  return (
    <BaseTable<Row>
      data={[...data]}
      columns={columns?.map(column => ({
        key: column.key,
        header: column.header,
        width: toWidth(column.width),
        align: column.align,
        renderCell: column.renderCell,
      }))}
      idKey={idKey}
      // Tecton names two row heights; the scale underneath has three.
      density={density === 'sm' ? 'compact' : 'balanced'}
      dividers={dividers}
      isStriped={isStriped}
      hasHover={hasHover}
      textOverflow={textOverflow}
      verticalAlign={verticalAlign}
      data-testid={testId}
    />
  );
}

Table.displayName = 'Table';
