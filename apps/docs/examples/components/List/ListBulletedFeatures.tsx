'use client';

import {List, ListItem} from '@tecton/react/List';

export function ListBulletedFeatures() {
  return (
    <List listStyle="disc">
      <ListItem label="Accessible by default" />
      <ListItem label="Themeable with StyleX" />
      <ListItem label="Composable and extensible" />
    </List>
  );
}
