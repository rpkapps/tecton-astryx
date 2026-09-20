import {Button} from '../../Button/Button.js';
import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../../ChatMessageBubble/ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {ChatMessageMetadata} from '../ChatMessageMetadata.js';
import {HStack} from '../../HStack/HStack.js';
import {Text} from '../../Text/Text.js';
import {Timestamp} from '../../Timestamp/Timestamp.js';

export function ChatMessageMetadataFooter() {
  return (
    <ChatMessageList style={{maxWidth: 500}}>
      <ChatMessage sender="user">
        <ChatMessageBubble
          metadata={
            <ChatMessageMetadata
              timestamp={
                <Timestamp value="2026-04-29T09:41:00" format="time" />
              }
              status="read"
            />
          }
        >
          Summarize the Q1 revenue report.
        </ChatMessageBubble>
      </ChatMessage>
      <ChatMessage sender="assistant">
        <ChatMessageBubble
          metadata={
            <ChatMessageMetadata
              timestamp={
                <Timestamp value="2026-04-29T09:42:00" format="time" />
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
                    GPT-4o
                  </Text>
                </HStack>
              }
            />
          }
        >
          Q1 revenue reached $2.4B, up 18% year-over-year. Enterprise
          subscriptions drove 62% of the growth, while ad revenue held steady at
          $890M.
        </ChatMessageBubble>
      </ChatMessage>
    </ChatMessageList>
  );
}
