import {CodeBlock} from '../CodeBlock.js';
import {VStack} from '../../VStack/VStack.js';

export function CodeBlockBashCommand() {
  return (
    <VStack gap={4}>
      <CodeBlock
        code="npm install @astryxdesign/core"
        language="bash"
        hasCopyButton
        style={{width: '100%'}}
      />
      <CodeBlock
        code="yarn add @astryxdesign/theme-neutral"
        language="bash"
        hasCopyButton
        style={{width: '100%'}}
      />
    </VStack>
  );
}
