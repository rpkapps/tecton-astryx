import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChatMessageBubbleVariants() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Filled — sender-colored background (default)
        </Text>
        <ChatMessageList>
          <ChatMessage sender="user">
            <ChatMessageBubble>
              Can you summarize the latest deployment logs?
            </ChatMessageBubble>
          </ChatMessage>
        </ChatMessageList>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Ghost — transparent background, keeps alignment padding
        </Text>
        <ChatMessageList>
          <ChatMessage sender="assistant">
            <ChatMessageBubble variant="ghost">
              The last deploy completed at 2:41 PM with zero errors across all
              three regions.
            </ChatMessageBubble>
          </ChatMessage>
        </ChatMessageList>
      </Stack>
    </Stack>
  );
}
