'use client';

import {Kbd} from '@tecton/react/Kbd';
import {Card} from '@tecton/react/Card';
import {List, ListItem} from '@tecton/react/List';

const menuItems = [
  {label: 'Cut', keys: 'mod+x'},
  {label: 'Copy', keys: 'mod+c'},
  {label: 'Paste', keys: 'mod+v'},
  {label: 'Undo', keys: 'mod+z'},
  {label: 'Redo', keys: 'mod+shift+z'},
] as const;

export function KbdMenuShortcuts() {
  return (
    <Card padding={0}>
      <List density="compact">
        {menuItems.map(item => (
          <ListItem
            key={item.label}
            label={item.label}
            endContent={<Kbd keys={item.keys} />}
          />
        ))}
      </List>
    </Card>
  );
}
