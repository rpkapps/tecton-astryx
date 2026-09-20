'use client';

import {useState} from 'react';
import {Popover} from '@tecton/react/Popover';
import {Button} from '@tecton/react/Button';
import {VStack, HStack} from '@tecton/react/Layout';
import {Heading, Text} from '@tecton/react/Text';
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
          <Text type="body">
            This will permanently delete the project and all its data. This
            action cannot be undone.
          </Text>
          <HStack gap={2} hAlign="end">
            <Button
              label="Delete"
              variant="destructive"
              onClick={() => setIsOpen(false)}
            >
              Delete
            </Button>
            <Button
              label="Cancel"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </HStack>
        </VStack>
      }
    >
      <Button label="Delete project" variant="destructive">
        Delete project
      </Button>
    </Popover>
  );
}
