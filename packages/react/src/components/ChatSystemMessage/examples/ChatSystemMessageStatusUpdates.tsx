import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatSystemMessage} from '../ChatSystemMessage.js';

export function ChatSystemMessageStatusUpdates() {
  return (
    <ChatMessageList>
      <ChatSystemMessage variant="divider">March 14, 2026</ChatSystemMessage>
      <ChatSystemMessage icon="person">
        Sarah Chen joined the conversation
      </ChatSystemMessage>
      <ChatSystemMessage>
        Topic changed to "Q2 Launch Planning"
      </ChatSystemMessage>
      <ChatSystemMessage variant="divider">March 15, 2026</ChatSystemMessage>
      <ChatSystemMessage icon="person">
        Alex Rivera left the conversation
      </ChatSystemMessage>
      <ChatSystemMessage variant="divider">Today</ChatSystemMessage>
      <ChatSystemMessage icon="check-circle">
        Conversation marked as resolved
      </ChatSystemMessage>
    </ChatMessageList>
  );
}
