'use client';

import {ChatMessageList, ChatSystemMessage} from '@tecton/react/Chat';
import {Icon} from '@tecton/react/Icon';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {LockIcon, PersonIcon, Robot2Icon} from '@tecton/react/icons';

export function ChatSystemMessageWithIcon() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text type="supporting" color="secondary">
        Icons reinforce the message type
      </Text>
      <ChatMessageList>
        <ChatSystemMessage icon={<Icon icon={PersonIcon} />}>
          Jordan was added to the conversation
        </ChatSystemMessage>
        <ChatSystemMessage icon={<Icon icon={LockIcon} />}>
          Messages are end-to-end encrypted
        </ChatSystemMessage>
        <ChatSystemMessage icon={<Icon icon={Robot2Icon} />}>
          Agent is generating a response…
        </ChatSystemMessage>
        <ChatSystemMessage icon={<Icon icon={LockIcon} />}>
          Conversation verified by admin
        </ChatSystemMessage>
      </ChatMessageList>
    </Stack>
  );
}
