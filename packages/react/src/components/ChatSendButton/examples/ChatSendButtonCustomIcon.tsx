import {ChatSendButton} from '../ChatSendButton.js';
import {Icon} from '../../Icon/Icon.js';
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
          sendIcon={<Icon name={'arrow-right'} size={16} />}
        />
        <ChatSendButton
          isDisabled={false}
          onSend={() => {}}
          sendIcon={<Icon name={'check'} size={16} />}
        />
        <ChatSendButton
          isDisabled={false}
          onSend={() => {}}
          sendIcon={<Icon name={'robot-2'} size={16} />}
        />
        <ChatSendButton
          isStopShown
          onStop={() => {}}
          stopIcon={<Icon name={'cancel-circle'} size={16} />}
        />
      </Stack>
    </Stack>
  );
}
