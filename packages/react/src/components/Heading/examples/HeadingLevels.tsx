import {Heading} from '../Heading.js';
import {VStack} from '../../VStack/VStack.js';

export function HeadingLevels() {
  return (
    <VStack gap={2}>
      <Heading level={1} variant="display3">
        $170.3m
      </Heading>
      <Heading level={1}>Troll West</Heading>
      <Heading level={2}>Facies modelling</Heading>
      <Heading level={3}>Lithotype density</Heading>
      <Heading level={4}>Channel sand</Heading>
    </VStack>
  );
}
