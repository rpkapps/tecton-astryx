import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../ChatMessageBubble.js';
import {ChatMessageList} from '../../ChatMessageList/ChatMessageList.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

const DENSITIES = [
  {density: 'compact' as const, label: 'Compact'},
  {density: 'balanced' as const, label: 'Balanced'},
  {density: 'spacious' as const, label: 'Spacious'},
];

export function ChatMessageBubbleDensity() {
  return (
    <VStack gap={5}>
      {DENSITIES.map(({density, label}) => (
        <VStack key={density} gap={1}>
          <Text variant="small" color="secondary">
            {label}
          </Text>
          <ChatMessageList density={density}>
            <ChatMessage sender="assistant">
              <ChatMessageBubble>
                The build completed in 4.2 seconds.
              </ChatMessageBubble>
            </ChatMessage>
            <ChatMessage sender="user">
              <ChatMessageBubble>Ship it to staging.</ChatMessageBubble>
            </ChatMessage>
          </ChatMessageList>
        </VStack>
      ))}
    </VStack>
  );
}
