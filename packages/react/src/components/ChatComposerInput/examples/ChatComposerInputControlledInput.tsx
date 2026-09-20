import {useState} from 'react';
import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerInput} from '../ChatComposerInput.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

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
      <Text variant="small" color="secondary">
        Value: {JSON.stringify(value)}
      </Text>
    </Stack>
  );
}
