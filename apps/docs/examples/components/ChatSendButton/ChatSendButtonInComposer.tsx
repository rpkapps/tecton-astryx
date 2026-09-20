'use client';

import {ChatComposer} from '@tecton/react/Chat';
import {Stack} from '@tecton/react/Layout';

export function ChatSendButtonInComposer() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        value="Hello, how can you help?"
        onChange={() => {}}
      />
    </Stack>
  );
}
