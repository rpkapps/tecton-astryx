'use client';

import {
  ChatMessageList,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageMetadata,
} from '@tecton/react/Chat';
import {Timestamp} from '@tecton/react/Timestamp';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {Text} from '@tecton/react/Text';
import {HStack} from '@tecton/react/Layout';
import {
  CancelCircleIcon,
  CheckCircleOpenIcon,
  CopyIcon,
  RotateIcon,
} from '@tecton/react/icons';

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
