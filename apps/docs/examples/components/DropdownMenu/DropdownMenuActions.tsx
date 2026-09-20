'use client';

import {useState} from 'react';
import {DropdownMenu} from '@tecton/react/DropdownMenu';
import {VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function DropdownMenuActions() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <VStack gap={3}>
      <DropdownMenu
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
        <Text type="supporting" color="secondary">
          Last action: {lastAction}
        </Text>
      )}
    </VStack>
  );
}
