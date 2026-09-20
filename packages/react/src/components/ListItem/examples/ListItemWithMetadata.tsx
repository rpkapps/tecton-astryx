import {Badge} from '../../Badge/Badge.js';
import {Icon} from '../../Icon/Icon.js';
import {List} from '../../List/List.js';
import {ListItem} from '../ListItem.js';
import {Text} from '../../Text/Text.js';

export function ListItemWithMetadata() {
  return (
    <List header="Inbox" density="condensed" hasDividers>
      <ListItem
        label="Launch checklist"
        description="3 tasks still need an owner"
        startContent={<Icon name="check" size={16} />}
        endContent={<Badge label="3" />}
        isSelected
        onClick={() => {}}
      />
      <ListItem
        label="Security review"
        description="Waiting on approval"
        startContent={<Icon name="warning" size={16} />}
        endContent={<Text color="secondary">Yesterday</Text>}
        onClick={() => {}}
      />
      <ListItem
        label="Old incident report"
        description="Archived and read-only"
        startContent={<Icon name="copy" size={16} />}
        endContent={<Text color="secondary">Apr 12</Text>}
        isDisabled
      />
    </List>
  );
}
