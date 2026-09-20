import {Avatar} from '../../Avatar/Avatar.js';
import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../../ChatMessageBubble/ChatMessageBubble.js';
import {ChatMessageList} from '../ChatMessageList.js';
import {ChatMessageMetadata} from '../../ChatMessageMetadata/ChatMessageMetadata.js';
import {ChatSystemMessage} from '../../ChatSystemMessage/ChatSystemMessage.js';
import {Chip} from '../../Chip/Chip.js';
import {CodeBlock} from '../../CodeBlock/CodeBlock.js';
import {HStack} from '../../HStack/HStack.js';
import {Markdown} from '../../Markdown/Markdown.js';
import {Timestamp} from '../../Timestamp/Timestamp.js';
import {VStack} from '../../VStack/VStack.js';

export function ChatMessageListFullFeatured() {
  return (
    <VStack>
      <ChatMessageList>
        <ChatSystemMessage variant="divider">Today</ChatSystemMessage>

        <ChatMessage sender="user">
          <HStack gap={2} wrap="wrap">
            <Chip label="useReducer.ts" />
            <Chip label="formState.ts" />
          </HStack>
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
            Can you review these files?
          </ChatMessageBubble>
        </ChatMessage>

        <ChatMessage
          sender="assistant"
          avatar={<Avatar name="Agent" size={32} />}
        >
          <ChatMessageBubble group="first">
            <Markdown density="compact">
              {`Sure! Here's the key pattern from **useReducer.ts**:`}
            </Markdown>
          </ChatMessageBubble>
          <ChatMessageBubble group="last">
            <Markdown density="compact">
              {`The reducer is **pure and easy to test** — pass in state and action, assert on the output.`}
            </Markdown>
          </ChatMessageBubble>
          <ChatMessageBubble
            variant="ghost"
            group="middle"
            metadata={
              <ChatMessageMetadata
                timestamp={
                  <Timestamp value="2026-03-15T14:30:30" format="time" />
                }
              />
            }
          >
            <CodeBlock
              code={`const [state, dispatch] = useReducer(
  (state, action) => ({
    ...state,
    [action.field]: action.value,
  }),
  { name: '', email: '' }
);`}
              language="tsx"
            />
          </ChatMessageBubble>
        </ChatMessage>

        <ChatSystemMessage>Agent shared a code snippet</ChatSystemMessage>

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
            That's clean, thanks!
          </ChatMessageBubble>
        </ChatMessage>
      </ChatMessageList>
    </VStack>
  );
}
