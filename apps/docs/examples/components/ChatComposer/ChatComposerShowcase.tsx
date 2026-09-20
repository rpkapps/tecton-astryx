'use client';

import {ChatComposer} from '@tecton/react/Chat';
import {Stack} from '@tecton/react/Layout';

export function ChatComposerShowcase() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer onSubmit={() => {}} placeholder="Type a message…" />
    </Stack>
  );
}
