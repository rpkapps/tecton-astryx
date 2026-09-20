'use client';

import {TreeList} from '@tecton/react/TreeList';
import {Icon} from '@tecton/react/Icon';
import {FolderIcon, ReportsAnalyticsIcon} from '@tecton/react/icons';

export function TreeListFileTreeWithIcons() {
  return (
    <TreeList
      items={[
        {
          id: 'src',
          label: 'src',
          isExpanded: true,
          startContent: <Icon icon={FolderIcon} size="sm" />,
          children: [
            {
              id: 'app',
              label: 'App.tsx',
              onClick: () => {},
              startContent: <Icon icon={ReportsAnalyticsIcon} size="sm" />,
            },
            {
              id: 'index',
              label: 'index.tsx',
              onClick: () => {},
              startContent: <Icon icon={ReportsAnalyticsIcon} size="sm" />,
            },
          ],
        },
        {
          id: 'pkg',
          label: 'package.json',
          onClick: () => {},
          startContent: <Icon icon={ReportsAnalyticsIcon} size="sm" />,
        },
      ]}
    />
  );
}
