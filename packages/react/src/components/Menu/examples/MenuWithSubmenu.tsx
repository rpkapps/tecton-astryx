import {useState} from 'react';
import {Menu} from '../Menu.js';
import {MenuActionItem} from '../../MenuActionItem/MenuActionItem.js';
import {MenuSubMenu} from '../../MenuSubMenu/MenuSubMenu.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function MenuWithSubmenu() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <VStack gap={3}>
      <Menu button={{label: 'Actions'}}>
        <MenuActionItem
          icon="diamond-mark"
          label="Rename"
          onClick={() => setLastAction('Rename')}
        />
        <MenuSubMenu icon="folder" label="Move to">
          <MenuActionItem
            label="Projects"
            onClick={() => setLastAction('Move to Projects')}
          />
          <MenuActionItem
            label="Archive"
            onClick={() => setLastAction('Move to Archive')}
          />
          <MenuActionItem
            label="Trash"
            onClick={() => setLastAction('Move to Trash')}
          />
        </MenuSubMenu>
        <MenuActionItem
          icon="diamond-mark"
          label="Delete"
          onClick={() => setLastAction('Delete')}
        />
      </Menu>
      {lastAction && (
        <Text variant="small" color="secondary">
          Last action: {lastAction}
        </Text>
      )}
    </VStack>
  );
}
