import {CodeBlock} from '../../CodeBlock/CodeBlock.js';
import {CodeTheme} from '../CodeTheme.js';
import {dracula} from '../../../support/index.js';

const code = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

export function CodeThemeDarkPreset() {
  return (
    <CodeTheme theme={dracula}>
      <CodeBlock code={code} language="tsx" title="Dracula preset" />
    </CodeTheme>
  );
}
