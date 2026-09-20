'use client';

import {SyntaxTheme} from '@tecton/react/theme';
import {githubLight} from '@tecton/react/theme/syntax';
import {CodeBlock} from '@tecton/react/CodeBlock';

const code = `const status = response.ok ? 'success' : 'error';
console.log({status});`;

export function SyntaxThemeLightPreset() {
  return (
    <SyntaxTheme theme={githubLight}>
      <CodeBlock code={code} language="tsx" title="GitHub Light preset" />
    </SyntaxTheme>
  );
}
