'use client';

import {ChatSendButton} from '@tecton/react/Chat';
import {Icon} from '@tecton/react/Icon';
import {Stack} from '@tecton/react/Layout';
import {Robot2Icon} from '@tecton/react/icons';

export function ChatSendButtonShowcase() {
  return (
    <Stack direction="horizontal" gap={3} vAlign="center">
      <ChatSendButton isDisabled={false} onSend={() => {}} />
      <ChatSendButton
        isDisabled={false}
        onSend={() => {}}
        sendIcon={<Icon icon={Robot2Icon} size="sm" />}
      />
      <ChatSendButton isStopShown onStop={() => {}} />
    </Stack>
  );
}
