import {Heading} from '../Heading.js';
import {VStack} from '../../VStack/VStack.js';

export function HeadingShowcase() {
  return (
    <VStack gap={2}>
      <Heading level={1}>Heading Level 1</Heading>
      <Heading level={2}>Heading Level 2</Heading>
      <Heading level={3}>Heading Level 3</Heading>
      <Heading level={4}>Heading Level 4</Heading>
      <Heading level={5}>Heading Level 5</Heading>
      <Heading level={6}>Heading Level 6</Heading>
    </VStack>
  );
}
