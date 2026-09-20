import {Code} from '../Code.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function CodeVariousContent() {
  return (
    <VStack gap={3}>
      <Text variant="medium">
        Variable: <Code>const count = 0</Code>
      </Text>
      <Text variant="medium">
        Terminal: <Code>yarn build --watch</Code>
      </Text>
      <Text variant="medium">
        CSS property: <Code>border-radius: 8px</Code>
      </Text>
      <Text variant="medium">
        File path: <Code>packages/core/src/CodeBlock/Code.tsx</Code>
      </Text>
      <Text variant="medium">
        Keyboard shortcut: <Code>Ctrl+Shift+P</Code>
      </Text>
    </VStack>
  );
}
