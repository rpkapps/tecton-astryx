/**
 * Tecton BreadcrumbItem.
 *
 * One crumb in a `Breadcrumbs` trail. The last crumb is treated as the current
 * page unless another one claims it.
 */
import type {MouseEvent, ReactNode} from 'react';
import {BreadcrumbItem as BaseBreadcrumbItem} from '@astryxdesign/core/Breadcrumbs';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';

export interface BreadcrumbItemProps {
  /** The crumb's label. */
  children: ReactNode;
  /** Where the crumb goes. Omit it for a crumb that does not navigate. */
  href?: string;
  /** Glyph rendered before the label, by name or as an SVG component. */
  icon?: TectonIconRef;
  /**
   * Marks this crumb as the current page. Left unset, the last crumb is the
   * current one; pass `false` to opt out.
   */
  isCurrent?: boolean;
  /** Click handler. */
  onClick?: (event: MouseEvent) => void;
  /** Test hook. */
  'data-testid'?: string;
}

export function BreadcrumbItem({
  children,
  href,
  icon,
  isCurrent,
  onClick,
  'data-testid': testId,
}: BreadcrumbItemProps) {
  return (
    <BaseBreadcrumbItem
      href={href}
      startIcon={renderIcon(icon, 16)}
      isCurrent={isCurrent}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </BaseBreadcrumbItem>
  );
}

BreadcrumbItem.displayName = 'BreadcrumbItem';
