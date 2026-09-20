'use client';

import {HoverCard} from '@tecton/react/HoverCard';
import {Avatar} from '@tecton/react/Avatar';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {VStack, HStack} from '@tecton/react/Layout';
import {Text, Heading} from '@tecton/react/Text';
import {HistoryIcon} from '@tecton/react/icons';

export function HoverCardProfileHoverCard() {
  return (
    <HoverCard
      placement="below"
      content={
        <HStack gap={3} vAlign="start" style={{maxWidth: 280}}>
          <Avatar name="Jane Doe" size={48} style={{flexShrink: 0}} />
          <VStack gap={1}>
            <Heading level={3}>@janedoe</Heading>
            <Text type="body" color="secondary">
              Crafting accessible, scalable design systems for modern teams.
            </Text>
            <HStack gap={1} vAlign="center">
              <Icon icon={HistoryIcon} size="xsm" color="secondary" />
              <Text type="supporting" color="secondary">
                March 2024
              </Text>
            </HStack>
          </VStack>
        </HStack>
      }
    >
      <Button label="@janedoe" variant="ghost" />
    </HoverCard>
  );
}
