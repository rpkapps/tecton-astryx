import {ListItem} from '../../ListItem/ListItem.js';
import {List} from '../List.js';

export function ListBasic() {
  return (
    <List header="Horizons" hasDividers>
      <ListItem label="Spekk fm top" description="2,525 m TVDSS" />
      <ListItem label="Draupne fm top" description="2,588 m TVDSS" />
      <ListItem label="Heather fm top" description="2,639 m TVDSS" />
    </List>
  );
}
