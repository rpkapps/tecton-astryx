import {ChatSendButton} from '../ChatSendButton.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChatSendButtonStates() {
  return (
    <Stack direction="vertical" gap={2}>
      <Text variant="small" color="secondary">
        Disabled → Ready → Streaming
      </Text>
      <Stack direction="horizontal" gap={3}>
        <ChatSendButton isDisabled onSend={() => {}} />
        <ChatSendButton isDisabled={false} onSend={() => {}} />
        <ChatSendButton isStopShown onStop={() => {}} />
      </Stack>
    </Stack>
  );
}
