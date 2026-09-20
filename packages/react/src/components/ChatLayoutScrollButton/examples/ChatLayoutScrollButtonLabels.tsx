import {ChatLayoutScrollButton} from '../ChatLayoutScrollButton.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChatLayoutScrollButtonLabels() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Labels expand the button to give context
      </Text>
      <Stack direction="vertical" gap={3}>
        <ChatLayoutScrollButton isVisible={true} onClick={() => {}} />
        <ChatLayoutScrollButton
          isVisible={true}
          label="New messages"
          onClick={() => {}}
        />
        <ChatLayoutScrollButton
          isVisible={true}
          label="3 unread replies"
          onClick={() => {}}
        />
      </Stack>
    </Stack>
  );
}
