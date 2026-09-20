import {Avatar} from '../../Avatar/Avatar.js';
import {Badge} from '../../Badge/Badge.js';
import {Icon} from '../../Icon/Icon.js';
import {List} from '../../List/List.js';
import {ListItem} from '../ListItem.js';

export function ListItemWithMedia() {
  return (
    <List header="Team" hasDividers>
      <ListItem
        label="Ada Lovelace"
        description="Design systems engineer"
        startContent={<Avatar name="Ada Lovelace" size={24} />}
        endContent={<Badge label="Owner" />}
        onClick={() => {}}
      />
      <ListItem
        label="Grace Hopper"
        description="Platform infrastructure"
        startContent={<Avatar name="Grace Hopper" size={24} />}
        endContent={<Badge label="On call" />}
        onClick={() => {}}
      />
      <ListItem
        label="Invite teammate"
        description="Send an invitation to collaborate"
        startContent={<Icon name="info" size={16} />}
        onClick={() => {}}
      />
    </List>
  );
}
