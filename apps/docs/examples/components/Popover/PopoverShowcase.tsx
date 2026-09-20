'use client';

import {useState} from 'react';
import {Popover} from '@tecton/react/Popover';
import {Button} from '@tecton/react/Button';
import {VStack} from '@tecton/react/Layout';
import {Text, Heading} from '@tecton/react/Text';
import {Divider} from '@tecton/react/Divider';

export function PopoverShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      hasAutoFocus={false}
      placement="below"
      label="Settings"
      width={280}
      content={
        <VStack gap={3}>
          <Heading level={4} tabIndex={0}>
            Settings
          </Heading>
          <Divider />
          <Text type="body">
            Notifications, dark mode, and sound preferences.
          </Text>
        </VStack>
      }
    >
      <Button label="Settings">Settings</Button>
    </Popover>
  );
}
