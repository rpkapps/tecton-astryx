import {Avatar} from '../../Avatar/Avatar.js';
import {ChatMessage} from '../ChatMessage.js';
import {ChatMessageBubble} from '../../ChatMessageBubble/ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatMessageMetadata} from '../../ChatMessageMetadata/ChatMessageMetadata.js';
import {Text} from '../../Text/Text.js';
import {Timestamp} from '../../Timestamp/Timestamp.js';

export function ChatMessageAvatarName() {
  return (
    <ChatMessageList style={{maxWidth: 500}}>
      <ChatMessage
        sender="assistant"
        avatar={<Avatar name="Agent" size={32} />}
      >
        <ChatMessageBubble
          name={
            <Text variant="small" weight="semibold" color="secondary">
              Agent
            </Text>
          }
          metadata={
            <ChatMessageMetadata
              timestamp={
                <Timestamp value="2026-04-28T10:15:00" format="time" />
              }
            />
          }
        >
          I reviewed the pull request. The changes look solid — clean code and
          good test coverage.
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="user">
        <ChatMessageBubble
          metadata={
            <ChatMessageMetadata
              timestamp={
                <Timestamp value="2026-04-28T10:16:00" format="time" />
              }
              status="read"
            />
          }
        >
          Thanks! Merging it now.
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage
        sender="assistant"
        avatar={<Avatar name="Agent" size={32} />}
      >
        <ChatMessageBubble
          name={
            <Text variant="small" weight="semibold" color="secondary">
              Agent
            </Text>
          }
          metadata={
            <ChatMessageMetadata
              timestamp={
                <Timestamp value="2026-04-28T10:17:00" format="time" />
              }
            />
          }
        >
          I can run the deployment pipeline once it lands. Just let me know.
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  );
}
