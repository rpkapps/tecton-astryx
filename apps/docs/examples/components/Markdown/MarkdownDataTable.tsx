'use client';

import {Center} from '@tecton/react/Center';
import {Markdown} from '@tecton/react/Markdown';

const content = [
  '## Comparison Table',
  '',
  '| Feature | React | Vue | Svelte |',
  '|:--------|:-----:|:---:|-------:|',
  '| Virtual DOM | Yes | Yes | No |',
  '| Bundle Size | ~40KB | ~30KB | ~2KB |',
  '| TypeScript | Native | Plugin | Native |',
  '| Learning Curve | Medium | Easy | Easy |',
].join('\n');

export function MarkdownDataTable() {
  return (
    <Center width="100%" style={{maxWidth: 450}}>
      <Markdown>{content}</Markdown>
    </Center>
  );
}
