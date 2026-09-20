'use client';

import {Code} from '@tecton/react/CodeBlock';
import {Text} from '@tecton/react/Text';
import {Heading} from '@tecton/react/Text';
import {VStack} from '@tecton/react/Stack';

export function CodeAcrossTextSizes() {
  return (
    <VStack gap={3}>
      <Heading level={3}>
        Heading with <Code>inline code</Code>
      </Heading>
      <Text type="body">
        Body text with <Code>inline code</Code>
      </Text>
      <Text type="supporting">
        Supporting text with <Code>inline code</Code>
      </Text>
      <Text type="label">
        Label text with <Code>inline code</Code>
      </Text>
    </VStack>
  );
}
