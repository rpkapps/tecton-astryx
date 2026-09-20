'use client';

import {Center} from '@tecton/react/Center';
import {Markdown} from '@tecton/react/Markdown';

const content = [
  '# Markdown Demo',
  '',
  'Renders **markdown** with *Tecton* styling.',
  '',
  '## Features',
  '',
  '- **Bold**, *italic*, `code`',
  '- [Links](https://example.com)',
  '',
  '```typescript',
  'interface User {name: string;}',
  '```',
  '',
  '- [x] Parser',
  '- [ ] Stories',
].join('\n');

export function MarkdownRichContent() {
  return (
    <Center width="100%" style={{maxWidth: 450}}>
      <Markdown>{content}</Markdown>
    </Center>
  );
}
