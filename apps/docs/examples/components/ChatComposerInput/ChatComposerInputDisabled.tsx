'use client';

import {ChatComposer, ChatComposerInput} from '@tecton/react/Chat';
import {Stack} from '@tecton/react/Layout';

export function ChatComposerInputDisabled() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        isDisabled
        input={<ChatComposerInput isDisabled placeholder="Input is disabled" />}
      />
    </Stack>
  );
}
