'use client';

import {HStack, VStack} from '@tecton/react/Layout';
import {Badge} from '@tecton/react/Badge';
import {Text} from '@tecton/react/Text';

export function VStackShowcase() {
  return (
    <HStack gap={10} hAlign="center">
      <VStack gap={2}>
        <Text type="supporting" color="secondary">
          gap=2
        </Text>
        <VStack gap={2}>
          <Badge label="Step 1" />
          <Badge label="Step 2" />
          <Badge label="Step 3" />
        </VStack>
      </VStack>
      <VStack gap={2}>
        <Text type="supporting" color="secondary">
          gap=4
        </Text>
        <VStack gap={4}>
          <Badge label="Step 1" />
          <Badge label="Step 2" />
          <Badge label="Step 3" />
        </VStack>
      </VStack>
      <VStack gap={2}>
        <Text type="supporting" color="secondary">
          gap=6
        </Text>
        <VStack gap={6}>
          <Badge label="Step 1" />
          <Badge label="Step 2" />
          <Badge label="Step 3" />
        </VStack>
      </VStack>
    </HStack>
  );
}
