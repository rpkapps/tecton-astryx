import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatSystemMessage} from '../ChatSystemMessage.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChatSystemMessageVariants() {
  return (
    <Stack direction="vertical" gap={4}>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Default
        </Text>
        <ChatMessageList>
          <ChatSystemMessage>Alex joined the conversation</ChatSystemMessage>
          <ChatSystemMessage>Conversation marked as resolved</ChatSystemMessage>
        </ChatMessageList>
      </Stack>
      <Stack direction="vertical" gap={1}>
        <Text variant="small" color="secondary">
          Divider
        </Text>
        <ChatMessageList>
          <ChatSystemMessage variant="divider">
            March 15, 2026
          </ChatSystemMessage>
          <ChatSystemMessage variant="divider">Today</ChatSystemMessage>
        </ChatMessageList>
      </Stack>
    </Stack>
  );
}
