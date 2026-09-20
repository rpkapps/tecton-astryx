import {ChatSendButton} from '../ChatSendButton.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChatSendButtonCustomIcon() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Custom icons for send and stop states
      </Text>
      <Stack direction="horizontal" gap={4}>
        <ChatSendButton
          isDisabled={false}
          onSend={() => {}}
          sendIcon="arrow-right"
        />
        <ChatSendButton isDisabled={false} onSend={() => {}} sendIcon="check" />
        <ChatSendButton
          isDisabled={false}
          onSend={() => {}}
          sendIcon="robot-2"
        />
        <ChatSendButton
          isStopShown
          onStop={() => {}}
          stopIcon="cancel-circle"
        />
      </Stack>
    </Stack>
  );
}
