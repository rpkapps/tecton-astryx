import {Alert} from '../Alert.js';
import {Button} from '../../Button/Button.js';
import {List} from '../../List/List.js';
import {ListItem} from '../../ListItem/ListItem.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function AlertCollapsibleContent() {
  return (
    <Alert
      status="warning"
      title="Configuration changes detected"
      description="Review the changes before they take effect."
      endContent={<Button label="Review" variant="secondary" size="sm" />}
      isDismissable
      collapsible={{defaultIsOpen: true}}
    >
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary">
          Changed settings:
        </Text>
        <List density="condensed">
          <ListItem label="Authentication method updated" />
          <ListItem label="Rate limits modified" />
        </List>
      </Stack>
    </Alert>
  );
}
