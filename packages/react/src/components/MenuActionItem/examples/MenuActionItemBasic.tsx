import {Menu} from '../../Menu/Menu.js';
import {MenuActionItem} from '../MenuActionItem.js';

export function MenuActionItemBasic() {
  return (
    <Menu button={{label: 'Actions'}}>
      <MenuActionItem
        label="Edit"
        description="Modify this item"
        onClick={() => {}}
      />
      <MenuActionItem
        label="Duplicate"
        description="Create a copy"
        onClick={() => {}}
      />
      <MenuActionItem
        label="Delete"
        description="This action cannot be undone"
        onClick={() => {}}
      />
    </Menu>
  );
}
