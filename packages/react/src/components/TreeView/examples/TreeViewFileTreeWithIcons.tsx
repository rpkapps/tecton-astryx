import {Icon} from '../../Icon/Icon.js';
import {TreeView} from '../TreeView.js';

export function TreeViewFileTreeWithIcons() {
  return (
    <TreeView
      items={[
        {
          id: 'src',
          label: 'src',
          isExpanded: true,
          startContent: <Icon name={'folder'} size={16} />,
          children: [
            {
              id: 'app',
              label: 'App.tsx',
              onClick: () => {},
              startContent: <Icon name={'reports-analytics'} size={16} />,
            },
            {
              id: 'index',
              label: 'index.tsx',
              onClick: () => {},
              startContent: <Icon name={'reports-analytics'} size={16} />,
            },
          ],
        },
        {
          id: 'pkg',
          label: 'package.json',
          onClick: () => {},
          startContent: <Icon name={'reports-analytics'} size={16} />,
        },
      ]}
    />
  );
}
