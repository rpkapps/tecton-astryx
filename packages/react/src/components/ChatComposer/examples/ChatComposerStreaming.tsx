import {useState} from 'react';
import {ChatComposer} from '../ChatComposer.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChatComposerStreaming() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [value, setValue] = useState(
    'Click the send button to start streaming.',
  );

  return (
    <Stack direction="vertical" gap={4} width={450} maxWidth="100%">
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          {isStreaming
            ? 'Streaming — click stop to cancel'
            : 'Send a message to start streaming'}
        </Text>
        <ChatComposer
          value={value}
          onChange={setValue}
          onSubmit={value => {
            console.log('Sent:', value);
            setValue('');
            setIsStreaming(true);
            setTimeout(() => setIsStreaming(false), 5000);
          }}
          isStopShown={isStreaming}
          onStop={() => {
            console.log('Stopped');
            setIsStreaming(false);
          }}
          placeholder="Send a message to start streaming..."
        />
      </Stack>
    </Stack>
  );
}
