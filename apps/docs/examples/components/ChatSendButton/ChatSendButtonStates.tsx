'use client';

import {ChatSendButton} from '@tecton/react/Chat';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function ChatSendButtonStates() {
  return (
    <Stack direction="vertical" gap={2}>
      <Text type="supporting" color="secondary">
        Disabled → Ready → Streaming
      </Text>
      <Stack direction="horizontal" gap={3} vAlign="center">
        <ChatSendButton isDisabled onSend={() => {}} />
        <ChatSendButton isDisabled={false} onSend={() => {}} />
        <ChatSendButton isStopShown onStop={() => {}} />
      </Stack>
    </Stack>
  );
}
