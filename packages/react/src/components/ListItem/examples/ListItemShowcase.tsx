import {Badge} from '../../Badge/Badge.js';
import {Icon} from '../../Icon/Icon.js';
import {List} from '../../List/List.js';
import {ListItem} from '../ListItem.js';

export function ListItemShowcase() {
  return (
    <List header="Settings" hasDividers>
      <ListItem
        label="Notifications"
        description="Push, email, and SMS alerts"
        startContent={<Icon name="info" />}
        endContent={<Badge label="3 new" />}
        onClick={() => {}}
      />
      <ListItem
        label="Privacy"
        description="Manage data sharing preferences"
        startContent={<Icon name="diamond-mark" />}
        onClick={() => {}}
      />
      <ListItem
        label="Appearance"
        description="Theme, font size, and display"
        startContent={<Icon name="diamond-mark" />}
        onClick={() => {}}
      />
      <ListItem
        label="Billing"
        description="Plans and payment methods"
        startContent={<Icon name="copy" />}
        endContent={<Badge label="Pro" />}
        onClick={() => {}}
      />
    </List>
  );
}
