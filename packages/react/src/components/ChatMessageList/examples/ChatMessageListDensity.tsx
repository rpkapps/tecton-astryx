import {Fragment} from 'react';
import {Avatar} from '../../Avatar/Avatar.js';
import {ChatMessage} from '../../ChatMessage/ChatMessage.js';
import {ChatMessageBubble} from '../../ChatMessageBubble/ChatMessageBubble.js';
import {ChatMessageList} from '../ChatMessageList.js';
import {Divider} from '../../Divider/Divider.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

const DENSITIES = ['compact', 'balanced', 'spacious'] as const;

const AVATAR_SIZE = {
  compact: 'sm' as const,
  balanced: 'md' as const,
  spacious: 'md' as const,
};

export function ChatMessageListDensity() {
  return (
    <VStack gap={4}>
      {DENSITIES.map((density, index) => (
        <Fragment key={density}>
          {index > 0 && <Divider />}
          <VStack gap={2}>
            <Text variant="small" color="secondary">
              {density.charAt(0).toUpperCase() + density.slice(1)}
            </Text>
            <VStack>
              <ChatMessageList density={density}>
                <ChatMessage sender="user">
                  <ChatMessageBubble>How does density work?</ChatMessageBubble>
                </ChatMessage>
                <ChatMessage
                  sender="assistant"
                  avatar={<Avatar name="Agent" size={AVATAR_SIZE[density]} />}
                >
                  <ChatMessageBubble>
                    Density provides default spacing at every level — message
                    gap, bubble padding, and gap between child elements. Use gap
                    to tune row spacing independently.
                  </ChatMessageBubble>
                </ChatMessage>
              </ChatMessageList>
            </VStack>
          </VStack>
        </Fragment>
      ))}
    </VStack>
  );
}
