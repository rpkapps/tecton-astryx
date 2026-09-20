import {useState} from 'react';
import {Menu} from '../Menu.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function MenuWithDisabledItems() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <VStack gap={3}>
      <Menu
        button={{label: 'Manage team'}}
        items={[
          {label: 'Invite member', onClick: () => setLastAction('Invite')},
          {label: 'Edit roles', onClick: () => setLastAction('Edit roles')},
          {type: 'divider'},
          {label: 'Transfer ownership', isDisabled: true},
          {label: 'Delete team', isDisabled: true},
        ]}
      />
      {lastAction && (
        <Text variant="small" color="secondary">
          Last action: {lastAction}
        </Text>
      )}
      <Text variant="small" color="secondary">
        Destructive actions are disabled for non-admin users
      </Text>
    </VStack>
  );
}
