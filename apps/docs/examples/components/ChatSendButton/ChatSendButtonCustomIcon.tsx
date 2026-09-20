'use client';

import {ChatSendButton} from '@tecton/react/Chat';
import {Icon} from '@tecton/react/Icon';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {
  ArrowRightIcon,
  CancelCircleIcon,
  CheckIcon,
  Robot2Icon,
} from '@tecton/react/icons';

export function ChatSendButtonCustomIcon() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text type="supporting" color="secondary">
        Custom icons for send and stop states
      </Text>
      <Stack direction="horizontal" gap={4} vAlign="center">
        <ChatSendButton
          isDisabled={false}
          onSend={() => {}}
          sendIcon={<Icon icon={ArrowRightIcon} size="sm" />}
        />
        <ChatSendButton
          isDisabled={false}
          onSend={() => {}}
          sendIcon={<Icon icon={CheckIcon} size="sm" />}
        />
        <ChatSendButton
          isDisabled={false}
          onSend={() => {}}
          sendIcon={<Icon icon={Robot2Icon} size="sm" />}
        />
        <ChatSendButton
          isStopShown
          onStop={() => {}}
          stopIcon={<Icon icon={CancelCircleIcon} size="sm" />}
        />
      </Stack>
    </Stack>
  );
}
