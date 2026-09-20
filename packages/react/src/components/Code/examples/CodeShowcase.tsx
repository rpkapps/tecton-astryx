import {Code} from '../Code.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function CodeShowcase() {
  return (
    <Stack direction="vertical" gap={3}>
      <Text variant="medium">
        Run <Code>npm install @astryxdesign/core</Code> to add the package.
      </Text>
      <Text variant="medium">
        Use the <Code>variant</Code> prop to switch between <Code>primary</Code>
        , <Code>secondary</Code>, and <Code>ghost</Code> styles.
      </Text>
    </Stack>
  );
}
