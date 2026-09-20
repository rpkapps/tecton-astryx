import {useState} from 'react';
import {BottomSheet} from '../../BottomSheet/BottomSheet.js';
import {BottomSheetSwitcher} from '../BottomSheetSwitcher.js';
import {Button} from '../../Button/Button.js';
import {Checkbox} from '../../Checkbox/Checkbox.js';
import {Divider} from '../../Divider/Divider.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Radio} from '../../Radio/Radio.js';
import {RadioGroup} from '../../RadioGroup/RadioGroup.js';
import {Section} from '../../Section/Section.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

type NotificationSheetHeight = 'hug' | 'capped';

interface NotificationOverviewSheetProps {
  height: NotificationSheetHeight;
  onCancel: () => void;
  onContinue: () => void;
}

function NotificationOverviewSheet({
  height,
  onCancel,
  onContinue,
}: NotificationOverviewSheetProps) {
  return (
    <BottomSheet
      sheetId="overview"
      label="Set up notifications"
      height={height}
    >
      <Section padding={4}>
        <VStack gap={4}>
          <VStack gap={1}>
            <Heading level={3}>Set up notifications</Heading>
            <Text variant="small" color="secondary">
              Step 1 of 3
            </Text>
          </VStack>
          <Divider />
          <Text variant="small" color="secondary">
            Stay informed about activity that matters without checking back
            throughout the day.
          </Text>
          <VStack gap={3}>
            <VStack gap={1}>
              <Text variant="smallStrong">Important activity</Text>
              <Text variant="small" color="secondary">
                Know when someone mentions you or needs your attention.
              </Text>
            </VStack>
            <VStack gap={1}>
              <Text variant="smallStrong">Timely reminders</Text>
              <Text variant="small" color="secondary">
                Get a reminder before work reaches its due date.
              </Text>
            </VStack>
            <VStack gap={1}>
              <Text variant="smallStrong">Useful summaries</Text>
              <Text variant="small" color="secondary">
                Catch up on anything you may have missed.
              </Text>
            </VStack>
          </VStack>
          <HStack gap={2}>
            <Button label="Cancel" variant="secondary" onClick={onCancel} />
            <Button label="Continue" onClick={onContinue} />
          </HStack>
        </VStack>
      </Section>
    </BottomSheet>
  );
}

interface NotificationFrequencySheetProps {
  height: NotificationSheetHeight;
  onBack: () => void;
  onContinue: () => void;
}

function NotificationFrequencySheet({
  height,
  onBack,
  onContinue,
}: NotificationFrequencySheetProps) {
  const [frequency, setFrequency] = useState('daily');

  return (
    <BottomSheet
      sheetId="frequency"
      label="Notification frequency"
      height={height}
    >
      <Section padding={4}>
        <VStack gap={4}>
          <VStack gap={1}>
            <Heading level={3}>How often?</Heading>
            <Text variant="small" color="secondary">
              Step 2 of 3
            </Text>
          </VStack>
          <Divider />
          <RadioGroup
            label="Notification frequency"
            isLabelHidden
            value={frequency}
            onChange={setFrequency}
          >
            <Radio label="Immediately" value="immediately" />
            <Radio label="Daily" value="daily" />
            <Radio label="Weekly" value="weekly" />
          </RadioGroup>
          <HStack gap={2}>
            <Button label="Back" variant="secondary" onClick={onBack} />
            <Button label="Continue" onClick={onContinue} />
          </HStack>
        </VStack>
      </Section>
    </BottomSheet>
  );
}

interface NotificationChannelsSheetProps {
  height: NotificationSheetHeight;
  onBack: () => void;
  onFinish: () => void;
}

function NotificationChannelsSheet({
  height,
  onBack,
  onFinish,
}: NotificationChannelsSheetProps) {
  const [email, setEmail] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [textMessages, setTextMessages] = useState(false);

  return (
    <BottomSheet
      sheetId="channels"
      label="Notification channels"
      height={height}
    >
      <Section padding={4}>
        <VStack gap={4}>
          <VStack gap={1}>
            <Heading level={3}>Where should we notify you?</Heading>
            <Text variant="small" color="secondary">
              Step 3 of 3
            </Text>
          </VStack>
          <Divider />
          <Text variant="small" color="secondary">
            Choose any combination. You can change these preferences later.
          </Text>
          <VStack gap={2}>
            <Checkbox label="Email" value={email} onChange={setEmail} />
            <Checkbox
              label="Push notifications"
              value={pushNotifications}
              onChange={setPushNotifications}
            />
            <Checkbox
              label="Text messages"
              value={textMessages}
              onChange={setTextMessages}
            />
          </VStack>
          <HStack gap={2}>
            <Button label="Back" variant="secondary" onClick={onBack} />
            <Button label="Finish" onClick={onFinish} />
          </HStack>
        </VStack>
      </Section>
    </BottomSheet>
  );
}

interface MultiStepSwitcherExampleProps {
  height: NotificationSheetHeight;
  hasScrim?: boolean;
}

function MultiStepSwitcherExample({
  height,
  hasScrim = true,
}: MultiStepSwitcherExampleProps) {
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  return (
    <>
      <Button
        label="Set up notifications"
        onClick={() => setActiveSheet('overview')}
      />
      <BottomSheetSwitcher
        activeSheet={activeSheet}
        onActiveSheetChange={setActiveSheet}
        hasScrim={hasScrim}
      >
        <NotificationOverviewSheet
          height={height}
          onCancel={() => setActiveSheet(null)}
          onContinue={() => setActiveSheet('frequency')}
        />
        <NotificationFrequencySheet
          height={height}
          onBack={() => setActiveSheet('overview')}
          onContinue={() => setActiveSheet('channels')}
        />
        <NotificationChannelsSheet
          height={height}
          onBack={() => setActiveSheet('frequency')}
          onFinish={() => setActiveSheet(null)}
        />
      </BottomSheetSwitcher>
    </>
  );
}

export function BottomSheetSwitcherShowcase() {
  return <MultiStepSwitcherExample height="hug" />;
}
