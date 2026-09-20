'use client';

import {List, ListItem} from '@tecton/react/List';

export function ListOrderedSteps() {
  return (
    <List listStyle="decimal">
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
