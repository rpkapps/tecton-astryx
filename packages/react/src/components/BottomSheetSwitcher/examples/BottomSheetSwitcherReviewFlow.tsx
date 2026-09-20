import {useState} from 'react';
import {BottomSheet} from '../../BottomSheet/BottomSheet.js';
import {BottomSheetSwitcher} from '../BottomSheetSwitcher.js';
import {Button} from '../../Button/Button.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Section} from '../../Section/Section.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function BottomSheetSwitcherReviewFlow() {
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  return (
    <>
      <Button
        label="Review settings"
        onClick={() => setActiveSheet('review')}
      />
      <BottomSheetSwitcher
        activeSheet={activeSheet}
        onActiveSheetChange={setActiveSheet}
      >
        <BottomSheet
          sheetId="review"
          label="Review notification settings"
          height="hug"
          purpose="form"
        >
          <Section padding={4}>
            <VStack gap={4}>
              <VStack gap={1}>
                <Heading level={3}>Review settings</Heading>
                <Text variant="small" color="secondary">
                  Daily summaries will be sent by email.
                </Text>
              </VStack>
              <HStack gap={2}>
                <Button
                  label="Cancel"
                  variant="secondary"
                  onClick={() => setActiveSheet(null)}
                />
                <Button
                  label="Continue"
                  onClick={() => setActiveSheet('confirm')}
                />
              </HStack>
            </VStack>
          </Section>
        </BottomSheet>
        <BottomSheet sheetId="confirm" label="Confirm settings" height="hug">
          <Section padding={4}>
            <VStack gap={4}>
              <VStack gap={1}>
                <Heading level={3}>Confirm settings</Heading>
                <Text variant="small" color="secondary">
                  Your notification settings are ready to save.
                </Text>
              </VStack>
              <HStack gap={2}>
                <Button
                  label="Back"
                  variant="secondary"
                  onClick={() => setActiveSheet('review')}
                />
                <Button label="Save" onClick={() => setActiveSheet(null)} />
              </HStack>
            </VStack>
          </Section>
        </BottomSheet>
      </BottomSheetSwitcher>
    </>
  );
}
