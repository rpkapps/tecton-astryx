import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Popover} from '../Popover.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function PopoverConfirmAction() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      placement="below"
      label="Confirm deletion"
      width={300}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      content={
        <VStack gap={3}>
          <Heading level={4}>Delete project?</Heading>
          <Text variant="medium">
            This will permanently delete the project and all its data. This
            action cannot be undone.
          </Text>
          <HStack gap={2}>
            <Button
              label="Delete"
              variant="destructive"
              onClick={() => setIsOpen(false)}
            />
            <Button
              label="Cancel"
              variant="tertiary"
              onClick={() => setIsOpen(false)}
            />
          </HStack>
        </VStack>
      }
    >
      <Button label="Delete project" variant="destructive" />
    </Popover>
  );
}
