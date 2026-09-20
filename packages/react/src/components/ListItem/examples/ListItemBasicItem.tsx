import {List} from '../../List/List.js';
import {ListItem} from '../ListItem.js';

export function ListItemBasicItem() {
  return (
    <List header="Account settings" hasDividers>
      <ListItem label="Profile" description="Name, avatar, and bio" />
      <ListItem label="Notifications" description="Email and push alerts" />
      <ListItem label="Security" description="Password and two-factor auth" />
    </List>
  );
}
