import {List} from '../List.js';
import {ListItem} from '../../ListItem/ListItem.js';

export function ListBasicList() {
  return (
    <List>
      <ListItem label="Notifications" description="Manage your alerts" />
      <ListItem label="Privacy" description="Control your data" />
      <ListItem label="Security" description="Password and 2FA" />
    </List>
  );
}
