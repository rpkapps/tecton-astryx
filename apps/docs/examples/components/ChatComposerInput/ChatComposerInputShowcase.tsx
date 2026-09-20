'use client';

import {ChatComposer, ChatComposerInput} from '@tecton/react/Chat';
import {Stack} from '@tecton/react/Layout';

export function ChatComposerInputShowcase() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        input={
          <ChatComposerInput placeholder="Ask me anything about Tecton..." />
        }
      />
    </Stack>
  );
}
