import {useState} from 'react';
import {BottomSheet} from '../BottomSheet.js';
import {Button} from '../../Button/Button.js';
import {Divider} from '../../Divider/Divider.js';
import {Heading} from '../../Heading/Heading.js';
import {Section} from '../../Section/Section.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function BottomSheetNoScrim() {
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundClicks, setBackgroundClicks] = useState(0);

  return (
    <Section padding={4}>
      <VStack gap={3}>
        <Heading level={3}>Nearby places</Heading>
        <Text variant="medium">
          Background interactions: {backgroundClicks}
        </Text>
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
        <VStack gap={4}>
          <Heading level={3}>Central Park</Heading>
          <Divider />
          <Text variant="medium">
            The page remains visible and interactive behind this sheet.
          </Text>
          <Button label="Close details" onClick={() => setIsOpen(false)} />
        </VStack>
      </BottomSheet>
    </Section>
  );
}
