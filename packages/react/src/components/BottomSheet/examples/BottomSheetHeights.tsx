import {useState} from 'react';
import {BottomSheet} from '../BottomSheet.js';
import {Button} from '../../Button/Button.js';
import {Divider} from '../../Divider/Divider.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';
import type {BottomSheetHeight} from '../../../support/index.js';

const descriptions: Record<BottomSheetHeight, string> = {
  hug: 'Hug fits short, bounded content.',
  capped: 'Capped starts at a comfortable mid-height for lists and filters.',
  tall: 'Tall reserves most of the viewport for long or changing content.',
};

export function BottomSheetHeights() {
  const [height, setHeight] = useState<BottomSheetHeight | null>(null);

  return (
    <>
      <HStack gap={2} wrap="wrap">
        <Button label="Open hug" onClick={() => setHeight('hug')} />
        <Button label="Open capped" onClick={() => setHeight('capped')} />
        <Button label="Open tall" onClick={() => setHeight('tall')} />
      </HStack>
      <BottomSheet
        isOpen={height != null}
        onOpenChange={isOpen => !isOpen && setHeight(null)}
        label={`${height ?? 'Hug'} height`}
        height={height ?? 'hug'}
      >
        <VStack gap={4}>
          <Heading level={3}>{height ?? 'Hug'} height</Heading>
          <Divider />
          <Text variant="medium">{descriptions[height ?? 'hug']}</Text>
          <Button label="Close" onClick={() => setHeight(null)} />
        </VStack>
      </BottomSheet>
    </>
  );
}
