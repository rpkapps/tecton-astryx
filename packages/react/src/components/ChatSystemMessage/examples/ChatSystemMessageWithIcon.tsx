import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatSystemMessage} from '../ChatSystemMessage.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChatSystemMessageWithIcon() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Icons reinforce the message type
      </Text>
      <ChatMessageList>
        <ChatSystemMessage icon="person">
          Jordan was added to the conversation
        </ChatSystemMessage>
        <ChatSystemMessage icon="lock">
          Messages are end-to-end encrypted
        </ChatSystemMessage>
        <ChatSystemMessage icon="robot-2">
          Agent is generating a response…
        </ChatSystemMessage>
        <ChatSystemMessage icon="lock">
          Conversation verified by admin
        </ChatSystemMessage>
      </ChatMessageList>
    </Stack>
  );
}
