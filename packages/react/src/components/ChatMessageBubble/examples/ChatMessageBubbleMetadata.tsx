import {Avatar} from '../../Avatar/Avatar.js';
import {Button} from '../../Button/Button.js';
import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatMessageMetadata} from '../../ChatMessageMetadata/ChatMessageMetadata.js';
import {HStack} from '../../HStack/HStack.js';
import {Text} from '../../Text/Text.js';
import {Timestamp} from '../../Timestamp/Timestamp.js';

export function ChatMessageBubbleMetadata() {
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
                <Timestamp value="2026-04-10T09:15:00" format="time" />
              }
              footer={
                <HStack gap={1}>
                  <Button
                    label="Copy"
                    variant="tertiary"
                    size="sm"
                    icon="copy"
                    onClick={() => {}}
                  />
                  <Text variant="small" color="secondary">
                    Claude Opus 4.6
                  </Text>
                </HStack>
              }
            />
          }
        >
          Your deployment finished successfully. All 14 checks passed.
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="user">
        <ChatMessageBubble
          metadata={
            <ChatMessageMetadata
              timestamp={
                <Timestamp value="2026-04-10T09:16:00" format="time" />
              }
              status="read"
            />
          }
        >
          Great, can you send me the production URL?
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  );
}
