'use client';

import {useState} from 'react';
import {BottomSheet, BottomSheetSwitcher} from '@tecton/react/BottomSheet';
import {Button} from '@tecton/react/Button';
import {Heading} from '@tecton/react/Heading';
import {Section} from '@tecton/react/Section';
import {HStack, VStack} from '@tecton/react/Stack';
import {Text} from '@tecton/react/Text';

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
                <Text type="supporting" color="secondary">
                  Daily summaries will be sent by email.
                </Text>
              </VStack>
              <HStack gap={2} hAlign="end">
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
                <Text type="supporting" color="secondary">
                  Your notification settings are ready to save.
                </Text>
              </VStack>
              <HStack gap={2} hAlign="end">
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
