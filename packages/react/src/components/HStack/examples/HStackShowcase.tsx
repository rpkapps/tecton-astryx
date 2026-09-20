import {Badge} from '../../Badge/Badge.js';
import {HStack} from '../HStack.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function HStackShowcase() {
  return (
    <VStack gap={6} width="100%">
      <VStack gap={2}>
        <Text variant="small" color="secondary">
          HAlign: start
        </Text>
        <HStack gap={2}>
          <Badge label="React" />
          <Badge label="TypeScript" />
          <Badge label="Node.js" />
        </HStack>
      </VStack>
      <VStack gap={2}>
        <Text variant="small" color="secondary">
          HAlign: center
        </Text>
        <HStack gap={4}>
          <Badge label="Design" />
          <Badge label="Engineering" />
          <Badge label="Product" />
        </HStack>
      </VStack>
      <VStack gap={2}>
        <Text variant="small" color="secondary">
          HAlign: between
        </Text>
        <HStack gap={2}>
          <Badge label="Start" />
          <Badge label="Middle" />
          <Badge label="End" />
        </HStack>
      </VStack>
    </VStack>
  );
}
