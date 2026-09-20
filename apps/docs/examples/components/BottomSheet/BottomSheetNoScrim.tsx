'use client';

import {useState} from 'react';
import {BottomSheet} from '@tecton/react/BottomSheet';
import {Button} from '@tecton/react/Button';
import {Divider} from '@tecton/react/Divider';
import {Heading} from '@tecton/react/Heading';
import {Section} from '@tecton/react/Section';
import {VStack} from '@tecton/react/Stack';
import {Text} from '@tecton/react/Text';

export function BottomSheetNoScrim() {
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundClicks, setBackgroundClicks] = useState(0);

  return (
    <Section padding={4}>
      <VStack gap={3}>
        <Heading level={3}>Nearby places</Heading>
        <Text type="body">Background interactions: {backgroundClicks}</Text>
        <Button
          label="Interact with page"
          variant="secondary"
          onClick={() => setBackgroundClicks(count => count + 1)}
        />
        <Button label="Show place details" onClick={() => setIsOpen(true)} />
      </VStack>
      <BottomSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        label="Place details"
        height="hug"
        hasScrim={false}
      >
        <VStack gap={4} style={{padding: 'var(--spacing-4)'}}>
          <Heading level={3}>Central Park</Heading>
          <Divider />
          <Text type="body">
            The page remains visible and interactive behind this sheet.
          </Text>
          <Button label="Close details" onClick={() => setIsOpen(false)} />
        </VStack>
      </BottomSheet>
    </Section>
  );
}
