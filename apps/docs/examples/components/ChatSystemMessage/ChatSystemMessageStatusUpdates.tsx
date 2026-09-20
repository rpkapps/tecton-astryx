'use client';

import {ChatMessageList, ChatSystemMessage} from '@tecton/react/Chat';
import {Icon} from '@tecton/react/Icon';
import {CheckCircleIcon, PersonIcon} from '@tecton/react/icons';

export function ChatSystemMessageStatusUpdates() {
  return (
    <ChatMessageList>
      <ChatSystemMessage variant="divider">March 14, 2026</ChatSystemMessage>
      <ChatSystemMessage icon={<Icon icon={PersonIcon} />}>
        Sarah Chen joined the conversation
      </ChatSystemMessage>
      <ChatSystemMessage>
        Topic changed to "Q2 Launch Planning"
      </ChatSystemMessage>
      <ChatSystemMessage variant="divider">March 15, 2026</ChatSystemMessage>
      <ChatSystemMessage icon={<Icon icon={PersonIcon} />}>
        Alex Rivera left the conversation
      </ChatSystemMessage>
      <ChatSystemMessage variant="divider">Today</ChatSystemMessage>
      <ChatSystemMessage icon={<Icon icon={CheckCircleIcon} />}>
        Conversation marked as resolved
      </ChatSystemMessage>
    </ChatMessageList>
  );
}
