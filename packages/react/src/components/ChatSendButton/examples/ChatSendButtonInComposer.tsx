import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {Stack} from '../../Stack/Stack.js';

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
