import {Badge} from '../../Badge/Badge.js';
import {HStack} from '../../HStack/HStack.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../VStack.js';

export function VStackShowcase() {
  return (
    <HStack gap={10}>
      <VStack gap={2}>
        <Text variant="small" color="secondary">
          gap=2
        </Text>
        <VStack gap={2}>
          <Badge label="Step 1" />
          <Badge label="Step 2" />
          <Badge label="Step 3" />
        </VStack>
      </VStack>
      <VStack gap={2}>
        <Text variant="small" color="secondary">
          gap=4
        </Text>
        <VStack gap={4}>
          <Badge label="Step 1" />
          <Badge label="Step 2" />
          <Badge label="Step 3" />
        </VStack>
      </VStack>
      <VStack gap={2}>
        <Text variant="small" color="secondary">
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
