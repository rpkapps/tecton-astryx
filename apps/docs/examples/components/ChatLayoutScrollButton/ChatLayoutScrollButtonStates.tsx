'use client';

import {ChatLayoutScrollButton} from '@tecton/react/Chat';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function ChatLayoutScrollButtonStates() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Hidden (user is at bottom)
        </Text>
        <ChatLayoutScrollButton isVisible={false} onClick={() => {}} />
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Visible (user scrolled up)
        </Text>
        <ChatLayoutScrollButton isVisible={true} onClick={() => {}} />
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Expanded with label (new messages arrived)
        </Text>
        <ChatLayoutScrollButton
          isVisible={true}
          label="New messages"
          onClick={() => {}}
        />
      </Stack>
    </Stack>
  );
}
