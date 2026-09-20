'use client';

import {SyntaxTheme} from '@tecton/react/theme';
import {dracula} from '@tecton/react/theme/syntax';
import {CodeBlock} from '@tecton/react/CodeBlock';

const code = `function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

export function SyntaxThemeDarkPreset() {
  return (
    <SyntaxTheme theme={dracula}>
      <CodeBlock code={code} language="tsx" title="Dracula preset" />
    </SyntaxTheme>
  );
}
