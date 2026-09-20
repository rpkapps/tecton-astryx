import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatSystemMessage} from '../ChatSystemMessage.js';
import {Icon} from '../../Icon/Icon.js';

export function ChatSystemMessageStatusUpdates() {
  return (
    <ChatMessageList>
      <ChatSystemMessage variant="divider">March 14, 2026</ChatSystemMessage>
      <ChatSystemMessage icon={<Icon name={'person'} />}>
        Sarah Chen joined the conversation
      </ChatSystemMessage>
      <ChatSystemMessage>
        Topic changed to "Q2 Launch Planning"
      </ChatSystemMessage>
      <ChatSystemMessage variant="divider">March 15, 2026</ChatSystemMessage>
      <ChatSystemMessage icon={<Icon name={'person'} />}>
        Alex Rivera left the conversation
      </ChatSystemMessage>
      <ChatSystemMessage variant="divider">Today</ChatSystemMessage>
      <ChatSystemMessage icon={<Icon name={'check-circle'} />}>
        Conversation marked as resolved
      </ChatSystemMessage>
    </ChatMessageList>
  );
}
