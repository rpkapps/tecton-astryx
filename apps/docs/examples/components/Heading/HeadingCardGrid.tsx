'use client';

import {Card} from '@tecton/react/Card';
import {VStack} from '@tecton/react/Layout';
import {Heading, Text} from '@tecton/react/Text';

export function HeadingCardGrid() {
  return (
    <Card width={300}>
      <VStack gap={2}>
        <Heading level={3}>Card Title</Heading>
        <Text type="body" maxLines={2} display="block">
          This is a card description that might be quite long and needs to be
          truncated after two lines to keep the card compact and uniform.
        </Text>
        <Text type="supporting" display="block">
          Updated 1 hour ago
        </Text>
      </VStack>
    </Card>
  );
}
