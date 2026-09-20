import {ChatSendButton} from '../ChatSendButton.js';
import {Icon} from '../../Icon/Icon.js';
import {Stack} from '../../Stack/Stack.js';

export function ChatSendButtonShowcase() {
  return (
    <Stack direction="horizontal" gap={3}>
      <ChatSendButton isDisabled={false} onSend={() => {}} />
      <ChatSendButton
        isDisabled={false}
        onSend={() => {}}
        sendIcon={<Icon name={'robot-2'} size={16} />}
      />
      <ChatSendButton isStopShown onStop={() => {}} />
    </Stack>
  );
}
