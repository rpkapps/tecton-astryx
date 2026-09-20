import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Divider} from '../../Divider/Divider.js';
import {Heading} from '../../Heading/Heading.js';
import {Popover} from '../Popover.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

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
          <Heading level={4}>Settings</Heading>
          <Divider />
          <Text variant="medium">
            Notifications, dark mode, and sound preferences.
          </Text>
        </VStack>
      }
    >
      <Button label="Settings" />
    </Popover>
  );
}
