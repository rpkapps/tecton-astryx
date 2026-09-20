import {List} from '../List.js';
import {ListItem} from '../../ListItem/ListItem.js';

export function ListBulletedFeatures() {
  return (
    <List listStyle="disc">
      <ListItem label="Accessible by default" />
      <ListItem label="Themeable with StyleX" />
      <ListItem label="Composable and extensible" />
    </List>
  );
}
