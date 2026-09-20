'use client';

import {List, ListItem} from '@tecton/react/List';
import {Badge} from '@tecton/react/Badge';
import {Icon} from '@tecton/react/Icon';

export function ListItemShowcase() {
  return (
    <List header="Settings" hasDividers>
      <ListItem
        label="Notifications"
        description="Push, email, and SMS alerts"
        startContent={<Icon icon="info" />}
        endContent={<Badge label="3 new" variant="blue" />}
        onClick={() => {}}
      />
      <ListItem
        label="Privacy"
        description="Manage data sharing preferences"
        startContent={<Icon icon="eyeSlash" />}
        onClick={() => {}}
      />
      <ListItem
        label="Appearance"
        description="Theme, font size, and display"
        startContent={<Icon icon="wrench" />}
        onClick={() => {}}
      />
      <ListItem
        label="Billing"
        description="Plans and payment methods"
        startContent={<Icon icon="copy" />}
        endContent={<Badge label="Pro" variant="purple" />}
        onClick={() => {}}
      />
    </List>
  );
}
