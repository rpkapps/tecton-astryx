/**
 * Tecton TreeView.
 *
 * A hierarchy of rows that open and close: a project's folders, a well's
 * horizons, a model's inputs. The items nest, each carrying the items below
 * it.
 */
import type {ReactNode} from 'react';
import {TreeList} from '@astryxdesign/core/TreeList';

/** How much air each row gets. */
export type TreeViewDensity = 'condensed' | 'default' | 'comfortable';

/** One row of a tree, and everything under it. */
export interface TreeItem {
  /** Identifies the row. */
  id: string;
  /** The row's text. */
  label: string;
  /** The rows nested under this one. */
  items?: readonly TreeItem[];
  /**
   * Whether the row starts open.
   * @default false
   */
  isExpanded?: boolean;
}

const DENSITY = {
  condensed: 'compact',
  default: 'balanced',
  comfortable: 'spacious',
} as const satisfies Record<TreeViewDensity, string>;

function toItem(item: TreeItem): {
  id: string;
  label: string;
  children?: unknown[];
  isExpanded?: boolean;
} {
  return {
    id: item.id,
    label: item.label,
    children: item.items?.map(toItem),
    isExpanded: item.isExpanded,
  };
}

export interface TreeViewProps {
  /** The top-level rows, each carrying the rows under it. */
  items: readonly TreeItem[];
  /**
   * How much air each row gets.
   * @default 'default'
   */
  density?: TreeViewDensity;
  /**
   * Draws connector lines from a row to the rows under it. Tecton's own trees
   * use indentation alone.
   * @default false
   */
  hasGuides?: boolean;
  /** A heading above the tree, which also names it for assistive technology. */
  header?: ReactNode;
  /** Test hook. */
  'data-testid'?: string;
}

export function TreeView({
  items,
  density = 'default',
  hasGuides = false,
  header,
  'data-testid': testId,
}: TreeViewProps) {
  return (
    <TreeList
      items={items.map(toItem) as Parameters<typeof TreeList>[0]['items']}
      density={DENSITY[density]}
      variant={hasGuides ? 'lineGuides' : 'noGuides'}
      header={header}
      data-testid={testId}
    />
  );
}

TreeView.displayName = 'TreeView';
