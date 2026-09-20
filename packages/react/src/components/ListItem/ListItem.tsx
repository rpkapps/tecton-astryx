/**
 * Tecton ListItem.
 *
 * One row of a `List`: a label, optionally a second line under it, and content
 * at either end. A row with `onClick` or `href` becomes the whole click
 * target, so the label is never the only thing that can be hit.
 */
import type {MouseEvent, ReactNode} from 'react';
import {ListItem as BaseListItem} from '@astryxdesign/core/List';

export interface ListItemProps {
  /** The row's primary text. */
  label: string;
  /** Secondary content under the label. */
  description?: ReactNode;
  /** Content before the label, such as an icon or an avatar. */
  startContent?: ReactNode;
  /** Content after the label, such as a badge or a chevron. */
  endContent?: ReactNode;
  /** Click handler. Makes the whole row the click target. */
  onClick?: (event: MouseEvent) => void;
  /** Where the row goes. Makes the whole row a link. */
  href?: string;
  /**
   * Marks the row as the one currently chosen.
   * @default false
   */
  isSelected?: boolean;
  /**
   * Prevents interaction and dims the row.
   * @default false
   */
  isDisabled?: boolean;
  /** Test hook. */
  'data-testid'?: string;
}

export function ListItem({
  label,
  description,
  startContent,
  endContent,
  onClick,
  href,
  isSelected = false,
  isDisabled = false,
  'data-testid': testId,
}: ListItemProps) {
  return (
    <BaseListItem
      label={label}
      description={description}
      startContent={startContent}
      endContent={endContent}
      onClick={onClick}
      href={href}
      isSelected={isSelected}
      isDisabled={isDisabled}
      data-testid={testId}
    />
  );
}

ListItem.displayName = 'ListItem';
