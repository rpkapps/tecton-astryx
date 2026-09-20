'use client';

import {Popover} from '@tecton/react/Popover';
import {Button} from '@tecton/react/Button';
import {VStack, HStack} from '@tecton/react/Layout';
import {Heading, Text} from '@tecton/react/Text';
import {Divider} from '@tecton/react/Divider';
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
              <Text type="body" weight="bold">
                {s.key}
              </Text>
              <Text type="body">{s.action}</Text>
            </HStack>
          ))}
        </VStack>
      }
    >
      <Button label="Shortcuts">Shortcuts</Button>
    </Popover>
  );
}
