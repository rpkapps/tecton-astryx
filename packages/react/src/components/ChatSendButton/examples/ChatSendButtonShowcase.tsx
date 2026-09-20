import {ChatSendButton} from '../ChatSendButton.js';
import {Stack} from '../../Stack/Stack.js';

export function ChatSendButtonShowcase() {
  return (
    <Stack direction="horizontal" gap={3}>
      <ChatSendButton isDisabled={false} onSend={() => {}} />
      <ChatSendButton isDisabled={false} onSend={() => {}} sendIcon="robot-2" />
      <ChatSendButton isStopShown onStop={() => {}} />
    </Stack>
  );
}
