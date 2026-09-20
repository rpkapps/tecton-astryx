import {List} from '../List.js';
import {ListItem} from '../../ListItem/ListItem.js';

export function ListOrderedSteps() {
  return (
    <List>
      <ListItem
        label="Install the package"
        description="npm install @astryxdesign/core"
      />
      <ListItem
        label="Import components"
        description="import { List } from '@astryxdesign/core'"
      />
      <ListItem
        label="Start building"
        description="Use components in your app"
      />
    </List>
  );
}
