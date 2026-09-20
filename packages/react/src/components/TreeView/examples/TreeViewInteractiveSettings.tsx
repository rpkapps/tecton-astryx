import {Icon} from '../../Icon/Icon.js';
import {TreeView} from '../TreeView.js';

export function TreeViewInteractiveSettings() {
  return (
    <TreeView
      items={[
        {
          id: 'settings',
          label: 'Settings',
          isExpanded: true,
          startContent: <Icon name={'settings'} size={16} />,
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
          endContent: <Icon name={'chevron-right'} size={16} />,
        },
      ]}
    />
  );
}
