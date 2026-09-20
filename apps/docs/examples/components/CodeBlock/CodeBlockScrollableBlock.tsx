'use client';

import {CodeBlock} from '@tecton/react/CodeBlock';

const code = Array.from(
  {length: 50},
  (_, i) => `const line${i + 1} = ${i + 1};`,
).join('\n');

export function CodeBlockScrollableBlock() {
  return (
    <CodeBlock
      code={code}
      language="typescript"
      title="many-lines.ts"
      hasLineNumbers
      maxHeight={280}
    />
  );
}
