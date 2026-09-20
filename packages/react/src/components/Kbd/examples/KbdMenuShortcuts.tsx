import {Card} from '../../Card/Card.js';
import {Kbd} from '../Kbd.js';
import {List} from '../../List/List.js';
import {ListItem} from '../../ListItem/ListItem.js';

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
      <List density="condensed">
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
