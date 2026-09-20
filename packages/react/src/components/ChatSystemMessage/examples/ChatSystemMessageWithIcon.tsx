import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatSystemMessage} from '../ChatSystemMessage.js';
import {Icon} from '../../Icon/Icon.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function ChatSystemMessageWithIcon() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text variant="small" color="secondary">
        Icons reinforce the message type
      </Text>
      <ChatMessageList>
        <ChatSystemMessage icon={<Icon name={'person'} />}>
          Jordan was added to the conversation
        </ChatSystemMessage>
        <ChatSystemMessage icon={<Icon name={'lock'} />}>
          Messages are end-to-end encrypted
        </ChatSystemMessage>
        <ChatSystemMessage icon={<Icon name={'robot-2'} />}>
          Agent is generating a response…
        </ChatSystemMessage>
        <ChatSystemMessage icon={<Icon name={'lock'} />}>
          Conversation verified by admin
        </ChatSystemMessage>
      </ChatMessageList>
    </Stack>
  );
}
