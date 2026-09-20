import {Chip} from '../../Chip/Chip.js';
import {HStack} from '../../HStack/HStack.js';
import {VStack} from '../../VStack/VStack.js';

export function StackDirections() {
  return (
    <HStack gap={10}>
      <HStack gap={2}>
        <Chip label="Horizontal" />
        <Chip label="Horizontal" />
        <Chip label="Horizontal" />
      </HStack>
      <VStack gap={2}>
        <Chip label="Vertical" />
        <Chip label="Vertical" />
        <Chip label="Vertical" />
      </VStack>
    </HStack>
  );
}
