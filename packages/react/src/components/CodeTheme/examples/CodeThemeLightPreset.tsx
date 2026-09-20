import {CodeBlock} from '../../CodeBlock/CodeBlock.js';
import {CodeTheme} from '../CodeTheme.js';
import {githubLight} from '../../../support/index.js';

const code = `const status = response.ok ? 'success' : 'error';
console.log({status});`;

export function CodeThemeLightPreset() {
  return (
    <CodeTheme theme={githubLight}>
      <CodeBlock code={code} language="tsx" title="GitHub Light preset" />
    </CodeTheme>
  );
}
