import {useState} from 'react';
import {Menu} from '../Menu.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function MenuWithSections() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <VStack gap={3}>
      <Menu
        button={{label: 'File', variant: 'ghost'}}
        items={[
          {
            type: 'section',
            title: 'Create',
            items: [
              {
                label: 'New document',
                onClick: () => setLastAction('New document'),
              },
              {
                label: 'New spreadsheet',
                onClick: () => setLastAction('New spreadsheet'),
              },
              {label: 'New folder', onClick: () => setLastAction('New folder')},
            ],
          },
          {
            type: 'section',
            title: 'Manage',
            items: [
              {label: 'Share', onClick: () => setLastAction('Share')},
              {label: 'Move', onClick: () => setLastAction('Move')},
              {label: 'Archive', onClick: () => setLastAction('Archive')},
            ],
          },
        ]}
      />
      {lastAction && (
        <Text variant="small" color="secondary">
          Selected: {lastAction}
        </Text>
      )}
    </VStack>
  );
}
