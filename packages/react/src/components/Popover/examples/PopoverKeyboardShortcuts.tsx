import {Button} from '../../Button/Button.js';
import {Divider} from '../../Divider/Divider.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Popover} from '../Popover.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

const shortcuts = [
  {key: '⌘K', action: 'Command palette'},
  {key: '⌘/', action: 'Toggle sidebar'},
  {key: '⌘.', action: 'Quick actions'},
];

export function PopoverKeyboardShortcuts() {
  return (
    <Popover
      placement="below"
      label="Keyboard shortcuts"
      width={260}
      content={
        <VStack gap={2}>
          <Heading level={4}>Keyboard shortcuts</Heading>
          <Divider />
          {shortcuts.map(s => (
            <HStack key={s.key} gap={3}>
              <Text variant="medium" weight="bold">
                {s.key}
              </Text>
              <Text variant="medium">{s.action}</Text>
            </HStack>
          ))}
        </VStack>
      }
    >
      <Button label="Shortcuts" label="Shortcuts" />
    </Popover>
  );
}
