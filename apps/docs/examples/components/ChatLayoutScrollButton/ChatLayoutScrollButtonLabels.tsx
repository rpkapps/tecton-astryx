'use client';

import {ChatLayoutScrollButton} from '@tecton/react/Chat';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function ChatLayoutScrollButtonLabels() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text type="supporting" color="secondary">
        Labels expand the button to give context
      </Text>
      <Stack direction="vertical" gap={3}>
        <ChatLayoutScrollButton isVisible={true} onClick={() => {}} />
        <ChatLayoutScrollButton
          isVisible={true}
          label="New messages"
          onClick={() => {}}
        />
        <ChatLayoutScrollButton
          isVisible={true}
          label="3 unread replies"
          onClick={() => {}}
        />
      </Stack>
    </Stack>
  );
}
