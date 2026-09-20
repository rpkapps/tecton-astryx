import {CodeBlock} from '../CodeBlock.js';
import {VStack} from '../../VStack/VStack.js';

export function CodeBlockBashCommand() {
  return (
    <VStack gap={4}>
      <CodeBlock
        code="npm install @tecton/react"
        language="bash"
        hasCopyButton
        style={{width: '100%'}}
      />
      <CodeBlock
        code="yarn add @tecton/react"
        language="bash"
        hasCopyButton
        style={{width: '100%'}}
      />
    </VStack>
  );
}
