import {useState} from 'react';
import {Menu} from '../Menu.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function MenuActions() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <VStack gap={3}>
      <Menu
        button={{label: 'Actions'}}
        items={[
          {label: 'Edit', onClick: () => setLastAction('Edit')},
          {label: 'Duplicate', onClick: () => setLastAction('Duplicate')},
          {label: 'Move to folder', onClick: () => setLastAction('Move')},
          {type: 'divider'},
          {label: 'Archive', onClick: () => setLastAction('Archive')},
          {label: 'Delete', onClick: () => setLastAction('Delete')},
        ]}
      />
      {lastAction && (
        <Text variant="small" color="secondary">
          Last action: {lastAction}
        </Text>
      )}
    </VStack>
  );
}
