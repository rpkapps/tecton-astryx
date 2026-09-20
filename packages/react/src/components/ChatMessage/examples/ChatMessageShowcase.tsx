import {ChatMessage} from '../ChatMessage.js';
import {ChatMessageBubble} from '../../ChatMessageBubble/ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatMessageMetadata} from '../../ChatMessageMetadata/ChatMessageMetadata.js';
import {Text} from '../../Text/Text.js';
import {Timestamp} from '../../Timestamp/Timestamp.js';

export function ChatMessageShowcase() {
  return (
    <ChatMessageList style={{maxWidth: 600}}>
      <ChatMessage sender="user">
        <ChatMessageBubble group="first">
          I just pushed the refactored auth module.
        </ChatMessageBubble>
        <ChatMessageBubble
          group="last"
          metadata={
            <ChatMessageMetadata
              timestamp={
                <Timestamp value="2026-04-28T14:30:00" format="time" />
              }
              status="read"
            />
          }
        >
          Can you review the token validation changes?
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <ChatMessageBubble
          variant="ghost"
          metadata={
            <ChatMessageMetadata
              timestamp={
                <Timestamp value="2026-04-28T14:31:00" format="time" />
              }
              footer={
                <Text variant="small" color="secondary">
                  Claude Opus 4.6
                </Text>
              }
            />
          }
        >
          Looks good — the refresh token rotation is solid and the error
          handling covers all the edge cases. Ship it.
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  );
}
