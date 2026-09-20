'use client';

import {
  ChatMessageList,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageMetadata,
} from '@tecton/react/Chat';
import {Timestamp} from '@tecton/react/Timestamp';
import {Text} from '@tecton/react/Text';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {HStack, VStack} from '@tecton/react/Layout';
import {
  CancelCircleIcon,
  CheckCircleOpenIcon,
  CopyIcon,
  RotateIcon,
} from '@tecton/react/icons';

export function ChatMessageMetadataShowcase() {
  return (
    <VStack style={{maxWidth: 600}}>
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
                      variant="ghost"
                      size="sm"
                      icon={<Icon icon={RotateIcon} size="sm" />}
                      isIconOnly
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
                      variant="ghost"
                      size="sm"
                      icon={<Icon icon={CopyIcon} size="sm" />}
                      isIconOnly
                      onClick={() => {}}
                    />
                    <Button
                      label="Retry"
                      variant="ghost"
                      size="sm"
                      icon={<Icon icon={RotateIcon} size="sm" />}
                      isIconOnly
                      onClick={() => {}}
                    />
                    <Button
                      label="Good response"
                      variant="ghost"
                      size="sm"
                      icon={<Icon icon={CheckCircleOpenIcon} size="sm" />}
                      isIconOnly
                      onClick={() => {}}
                    />
                    <Button
                      label="Bad response"
                      variant="ghost"
                      size="sm"
                      icon={<Icon icon={CancelCircleIcon} size="sm" />}
                      isIconOnly
                      onClick={() => {}}
                    />
                    <Text type="supporting" color="secondary">
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
