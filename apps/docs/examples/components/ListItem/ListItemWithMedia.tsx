'use client';

import {Avatar} from '@tecton/react/Avatar';
import {Badge} from '@tecton/react/Badge';
import {Icon} from '@tecton/react/Icon';
import {List, ListItem} from '@tecton/react/List';

export function ListItemWithMedia() {
  return (
    <List header="Team" hasDividers>
      <ListItem
        label="Ada Lovelace"
        description="Design systems engineer"
        startContent={<Avatar name="Ada Lovelace" size="sm" />}
        endContent={<Badge label="Owner" variant="purple" />}
        onClick={() => {}}
      />
      <ListItem
        label="Grace Hopper"
        description="Platform infrastructure"
        startContent={<Avatar name="Grace Hopper" size="sm" />}
        endContent={<Badge label="On call" variant="blue" />}
        onClick={() => {}}
      />
      <ListItem
        label="Invite teammate"
        description="Send an invitation to collaborate"
        startContent={<Icon icon="info" size="sm" color="secondary" />}
        onClick={() => {}}
      />
    </List>
  );
}
