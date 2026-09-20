'use client';

import {Code} from '@tecton/react/CodeBlock';
import {Text} from '@tecton/react/Text';
import {Stack} from '@tecton/react/Layout';

export function CodeShowcase() {
  return (
    <Stack direction="vertical" gap={3}>
      <Text type="body">
        Run <Code>npm install @astryxdesign/core</Code> to add the package.
      </Text>
      <Text type="body">
        Use the <Code>variant</Code> prop to switch between <Code>primary</Code>
        , <Code>secondary</Code>, and <Code>ghost</Code> styles.
      </Text>
    </Stack>
  );
}
