import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatMessageMetadata} from '../../ChatMessageMetadata/ChatMessageMetadata.js';
import {Timestamp} from '../../Timestamp/Timestamp.js';

export function ChatMessageBubbleShowcase() {
  return (
    <ChatMessageList style={{maxWidth: 600}}>
      <ChatMessage sender="user">
        <ChatMessageBubble group="first">
          I just pushed the latest changes to the feature branch.
        </ChatMessageBubble>
        <ChatMessageBubble
          group="last"
          metadata={
            <ChatMessageMetadata
              timestamp={
                <Timestamp value="2026-04-10T09:15:00" format="time" />
              }
              status="read"
            />
          }
        >
          Can you review when you get a chance?
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <ChatMessageBubble
          variant="ghost"
          metadata={
            <ChatMessageMetadata
              timestamp={
                <Timestamp value="2026-04-10T09:16:00" format="time" />
              }
            />
          }
        >
          The changes look great. Ship it!
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  );
}
