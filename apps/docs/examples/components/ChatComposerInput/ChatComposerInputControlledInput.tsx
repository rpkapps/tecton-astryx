'use client';

import {useState} from 'react';
import {ChatComposer, ChatComposerInput} from '@tecton/react/Chat';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function ChatComposerInputControlledInput() {
  const [value, setValue] = useState('');
  return (
    <Stack direction="vertical" gap={3} width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => setValue('')}
        value={value}
        onChange={setValue}
        input={
          <ChatComposerInput
            value={value}
            onChange={setValue}
            placeholder="Type a message..."
          />
        }
      />
      <Text type="supporting" color="secondary">
        Value: {JSON.stringify(value)}
      </Text>
    </Stack>
  );
}
