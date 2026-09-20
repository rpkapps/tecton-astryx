import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../../ChatMessageBubble/ChatMessageBubble.js';
import {ChatMessageList} from '../ChatMessageList.js';
import {ChatMessageMetadata} from '../../ChatMessageMetadata/ChatMessageMetadata.js';
import {ChatSystemMessage} from '../../ChatSystemMessage/ChatSystemMessage.js';
import {Timestamp} from '../../Timestamp/Timestamp.js';
import {VStack} from '../../VStack/VStack.js';

export function ChatMessageListShowcase() {
  return (
    <VStack>
      <ChatMessageList density="balanced">
        <ChatSystemMessage variant="divider">March 15, 2026</ChatSystemMessage>

        <ChatMessage sender="user">
          <ChatMessageBubble
            metadata={
              <ChatMessageMetadata
                timestamp={
                  <Timestamp value="2026-03-15T14:30:00" format="time" />
                }
                status="read"
              />
            }
          >
            How should I structure a monorepo?
          </ChatMessageBubble>
        </ChatMessage>

        <ChatMessage sender="assistant">
          <ChatMessageBubble
            metadata={
              <ChatMessageMetadata
                timestamp={
                  <Timestamp value="2026-03-15T14:30:15" format="time" />
                }
              />
            }
          >
            Use workspaces with a shared packages directory. Keep each package
            focused on a single concern.
          </ChatMessageBubble>
        </ChatMessage>

        <ChatMessage sender="user">
          <ChatMessageBubble
            metadata={
              <ChatMessageMetadata
                timestamp={
                  <Timestamp value="2026-03-15T14:31:00" format="time" />
                }
                status="delivered"
              />
            }
          >
            Should I use Yarn or pnpm for that?
          </ChatMessageBubble>
        </ChatMessage>
      </ChatMessageList>
    </VStack>
  );
}
