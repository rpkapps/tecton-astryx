import {ChatLayoutScrollButton} from '../ChatLayoutScrollButton.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChatLayoutScrollButtonStates() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Hidden (user is at bottom)
        </Text>
        <ChatLayoutScrollButton isVisible={false} onClick={() => {}} />
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Visible (user scrolled up)
        </Text>
        <ChatLayoutScrollButton isVisible={true} onClick={() => {}} />
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Expanded with label (new messages arrived)
        </Text>
        <ChatLayoutScrollButton
          isVisible={true}
          label="New messages"
          onClick={() => {}}
        />
      </Stack>
    </Stack>
  );
}
