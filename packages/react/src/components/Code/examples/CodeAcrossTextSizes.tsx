import {Code} from '../Code.js';
import {Heading} from '../../Heading/Heading.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function CodeAcrossTextSizes() {
  return (
    <VStack gap={3}>
      <Heading level={3}>
        Heading with <Code>inline code</Code>
      </Heading>
      <Text variant="medium">
        Body text with <Code>inline code</Code>
      </Text>
      <Text variant="small">
        Supporting text with <Code>inline code</Code>
      </Text>
      <Text variant="smallStrong">
        Label text with <Code>inline code</Code>
      </Text>
    </VStack>
  );
}
