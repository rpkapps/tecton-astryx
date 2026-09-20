import type {ReactNode} from 'react';
import {DocsLayout} from 'fumadocs-ui/layouts/docs';
import {getSidebarTree} from '@/lib/source';
import {baseOptions} from '@/lib/layout.shared';

/**
 * The docs shell. The tree is the grouped one: the component pages are folded
 * into the groups the library declares, so the sidebar is 75 rows with the
 * current page's group open rather than 144 rows in a column.
 */
export default function Layout({children}: {children: ReactNode}) {
  return (
    <DocsLayout
      tree={getSidebarTree()}
      sidebar={{defaultOpenLevel: 0}}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
