'use client';

import {ChatComposer} from '@tecton/react/Chat';
import {Stack} from '@tecton/react/Layout';

export function ChatComposerSimple() {
  return (
    <Stack direction="vertical" width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={value => {
          console.log('Sent:', value);
        }}
      />
    </Stack>
  );
}
