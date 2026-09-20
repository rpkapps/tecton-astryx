import {List} from '../List.js';
import {ListItem} from '../../ListItem/ListItem.js';

export function ListOrderedSteps() {
  return (
    <List>
      <ListItem
        label="Install the package"
        description="npm install @tecton/react"
      />
      <ListItem
        label="Import components"
        description="import { List } from '@tecton/react'"
      />
      <ListItem
        label="Start building"
        description="Use components in your app"
      />
    </List>
  );
}
