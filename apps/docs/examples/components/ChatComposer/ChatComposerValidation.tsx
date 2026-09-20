'use client';

import {ChatComposer} from '@tecton/react/Chat';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function ChatComposerValidation() {
  return (
    <Stack direction="vertical" gap={4} width={450} maxWidth="100%">
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Error message (with top position)
        </Text>
        <ChatComposer
          onSubmit={value => {
            console.log('Sent:', value);
          }}
          statusPosition="top"
          status={{
            type: 'error',
            message: 'Failed to send message. Please try again.',
          }}
        />
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text type="supporting" color="secondary">
          Warning message (with bottom position)
        </Text>
        <ChatComposer
          onSubmit={value => {
            console.log('Sent:', value);
          }}
          status={{
            type: 'warning',
            message: 'Context window is 90% full.',
          }}
        />
      </Stack>
    </Stack>
  );
}
