'use client';

import {Center} from '@tecton/react/Center';
import {Markdown} from '@tecton/react/Markdown';

const content = [
  '## Design Tokens',
  '',
  'Tokens are the **shared language** between design and code.',
  '',
  '```typescript',
  'const tokens = {',
  "  primary: '#0066FF',",
  "  spacing: '8px',",
  '};',
  '```',
  '',
  '- **Composable** — small pieces',
  '- **Accessible** — built-in a11y',
  '',
  '> Opinionated enough for consistency, *flexible* enough for edge cases.',
].join('\n');

export function MarkdownCompactAIResponse() {
  return (
    <Center style={{maxWidth: 450}}>
      <Markdown density="compact" headingLevelStart={3}>
        {content}
      </Markdown>
    </Center>
  );
}
