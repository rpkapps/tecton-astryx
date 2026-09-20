import {HStack} from '../../HStack/HStack.js';
import {Icon} from '../Icon.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function IconSemanticColors() {
  return (
    <HStack gap={4} wrap="wrap">
      <VStack gap={1}>
        <Icon name="search" />
        <Text variant="small">primary</Text>
      </VStack>
      <VStack gap={1}>
        <Icon name="menu" />
        <Text variant="small">secondary</Text>
      </VStack>
      <VStack gap={1}>
        <Icon name="info" />
        <Text variant="small">tertiary</Text>
      </VStack>
      <VStack gap={1}>
        <Icon name="diamond-mark" />
        <Text variant="small">disabled</Text>
      </VStack>
      <VStack gap={1}>
        <Icon name="diamond-mark" />
        <Text variant="small">accent</Text>
      </VStack>
      <VStack gap={1}>
        <Icon name="diamond-mark" />
        <Text variant="small">success</Text>
      </VStack>
      <VStack gap={1}>
        <Icon name="error" />
        <Text variant="small">error</Text>
      </VStack>
      <VStack gap={1}>
        <Icon name="warning" />
        <Text variant="small">warning</Text>
      </VStack>
    </HStack>
  );
}
