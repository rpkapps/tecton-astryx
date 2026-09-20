'use client';

import {Avatar} from '@tecton/react/Avatar';
import {HStack, VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function AvatarFallbackChain() {
  return (
    <VStack gap={4}>
      <HStack gap={3} vAlign="center">
        <Avatar
          src="/template-assets/DATA-Daniela-Gimenez.png"
          name="Daniela Gimenez"
          size="lg"
        />
        <Text type="supporting">Valid src</Text>
      </HStack>
      <HStack gap={3} vAlign="center">
        <Avatar
          src="/template-assets/does-not-exist-primary.jpg"
          fallbackSrc="/template-assets/DATA-Ami-Pena.png"
          name="Invalid User"
          size="lg"
        />
        <Text type="supporting">Invalid src, valid fallbackSrc</Text>
      </HStack>
      <HStack gap={3} vAlign="center">
        <Avatar
          src="/template-assets/does-not-exist-primary.jpg"
          fallbackSrc="/template-assets/does-not-exist-fallback.jpg"
          name="Test User"
          size="lg"
        />
        <Text type="supporting">Both invalid, has name</Text>
      </HStack>
      <HStack gap={3} vAlign="center">
        <Avatar src="/template-assets/does-not-exist-primary.jpg" size="lg" />
        <Text type="supporting">All invalid, no name</Text>
      </HStack>
    </VStack>
  );
}
