/**
 * Tecton Breadcrumbs.
 *
 * The trail from the top of the hierarchy to where the person is now. The last
 * crumb is the current page and does not navigate.
 */
import type {ReactNode} from 'react';
import {Breadcrumbs as BaseBreadcrumbs} from '@astryxdesign/core/Breadcrumbs';

/** How loudly the trail reads. */
export type BreadcrumbsVariant = 'default' | 'supporting';

export interface BreadcrumbsProps {
  /** The crumbs, in order from the root. */
  children: ReactNode;
  /**
   * What sits between two crumbs.
   * @default '/'
   */
  separator?: ReactNode;
  /**
   * How loudly the trail reads. `supporting` is smaller and quieter.
   * @default 'default'
   */
  variant?: BreadcrumbsVariant;
  /**
   * Accessible name for the navigation landmark.
   * @default 'Breadcrumb'
   */
  label?: string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Breadcrumbs({
  children,
  separator = '/',
  variant = 'default',
  label = 'Breadcrumb',
  'data-testid': testId,
}: BreadcrumbsProps) {
  return (
    <BaseBreadcrumbs
      separator={separator}
      variant={variant}
      label={label}
      data-testid={testId}
    >
      {children}
    </BaseBreadcrumbs>
  );
}

Breadcrumbs.displayName = 'Breadcrumbs';
