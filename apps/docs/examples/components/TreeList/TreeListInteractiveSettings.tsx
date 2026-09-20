'use client';

import {TreeList} from '@tecton/react/TreeList';
import {Icon} from '@tecton/react/Icon';
import {ChevronRightIcon, SettingsIcon} from '@tecton/react/icons';

export function TreeListInteractiveSettings() {
  return (
    <TreeList
      items={[
        {
          id: 'settings',
          label: 'Settings',
          isExpanded: true,
          startContent: <Icon icon={SettingsIcon} size="sm" />,
          children: [
            {
              id: 'general',
              label: 'General',
              onClick: () => {},
            },
            {
              id: 'advanced',
              label: 'Advanced',
              onClick: () => {},
            },
          ],
        },
        {
          id: 'docs',
          label: 'Documentation',
          href: '#',
          endContent: <Icon icon={ChevronRightIcon} size="sm" />,
        },
      ]}
    />
  );
}
