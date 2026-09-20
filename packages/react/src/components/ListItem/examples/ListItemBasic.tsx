import {Badge} from '../../Badge/Badge.js';
import {Icon} from '../../Icon/Icon.js';
import {List} from '../../List/List.js';
import {ListItem} from '../ListItem.js';

export function ListItemBasic() {
  return (
    <List>
      <ListItem
        label="15/9-19 A"
        description="Producer, drilled 2019"
        startContent={<Icon name="well" size={20} />}
        endContent={<Badge label="Active" variant="success" />}
        isSelected
      />
      <ListItem
        label="15/9-19 BT2"
        description="Sidetrack, drilled 2020"
        startContent={<Icon name="well" size={20} />}
      />
    </List>
  );
}
