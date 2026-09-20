import {Button} from '../../Button/Button.js';
import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../../ChatMessageBubble/ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatMessageMetadata} from '../ChatMessageMetadata.js';
import {HStack} from '../../HStack/HStack.js';
import {Text} from '../../Text/Text.js';
import {Timestamp} from '../../Timestamp/Timestamp.js';
import {VStack} from '../../VStack/VStack.js';

export function ChatMessageMetadataShowcase() {
  return (
    <VStack>
      <ChatMessageList>
        <ChatMessage sender="assistant">
          <ChatMessageBubble
            metadata={
              <ChatMessageMetadata
                timestamp={
                  <Timestamp value="2026-03-15T14:30:00" format="time" />
                }
                status="error"
                footer={
                  <HStack gap={1}>
                    <Button
                      label="Retry"
                      variant="tertiary"
                      size="sm"
                      icon="rotate"
                      onClick={() => {}}
                    />
                  </HStack>
                }
              />
            }
          >
            Sorry, something went wrong on my end.
          </ChatMessageBubble>
        </ChatMessage>

        <ChatMessage sender="user">
          <ChatMessageBubble
            metadata={
              <ChatMessageMetadata
                timestamp={
                  <Timestamp value="2026-03-15T14:31:00" format="time" />
                }
                status="read"
              />
            }
          >
            No worries — try again with just the last 24 hours of logs.
          </ChatMessageBubble>
        </ChatMessage>

        <ChatMessage sender="assistant">
          <ChatMessageBubble
            metadata={
              <ChatMessageMetadata
                timestamp={
                  <Timestamp value="2026-03-15T14:32:00" format="time" />
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
                    <Button
                      label="Retry"
                      variant="tertiary"
                      size="sm"
                      icon="rotate"
                      onClick={() => {}}
                    />
                    <Button
                      label="Good response"
                      variant="tertiary"
                      size="sm"
                      icon="check-circle-open"
                      onClick={() => {}}
                    />
                    <Button
                      label="Bad response"
                      variant="tertiary"
                      size="sm"
                      icon="cancel-circle"
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
            The canary at 11:42 AM caused a memory spike. Rolled back at 11:58
            AM.
          </ChatMessageBubble>
        </ChatMessage>
      </ChatMessageList>
    </VStack>
  );
}
