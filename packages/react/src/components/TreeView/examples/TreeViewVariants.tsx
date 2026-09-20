import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {TreeView} from '../TreeView.js';
import type {TreeViewNode as TreeListItemData} from '../../../support/index.js';

const noop = () => {};

const items: TreeListItemData[] = [
  {
    id: 'src',
    label: 'src',
    isExpanded: true,
    children: [
      {
        id: 'components',
        label: 'components',
        isExpanded: true,
        children: [
          {id: 'button', label: 'Button.tsx', onClick: noop},
          {id: 'card', label: 'Card.tsx', onClick: noop},
        ],
      },
      {id: 'app', label: 'App.tsx', onClick: noop},
    ],
  },
  {id: 'readme', label: 'README.md', onClick: noop},
];

export function TreeViewVariants() {
  return (
    <Stack direction="horizontal" gap={6} wrap="wrap">
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary" weight="bold">
          lineGuides (default)
        </Text>
        <TreeView items={items} variant="lineGuides" />
      </Stack>
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary" weight="bold">
          noGuides
        </Text>
        <TreeView items={items} variant="noGuides" />
      </Stack>
    </Stack>
  );
}
