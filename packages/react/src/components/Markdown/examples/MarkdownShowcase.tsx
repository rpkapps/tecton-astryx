import {Center} from '../../Center/Center.js';
import {Markdown} from '../Markdown.js';

const content = [
  '# Markdown Demo',
  '',
  'Renders **markdown** with *design-system-consistent* styling.',
  '',
  '## Features',
  '',
  '- Headings mapped to the Astryx type scale',
  '- **Bold**, *italic*, and ~~strikethrough~~ text',
  '- [Links](https://example.com) with external detection',
  '',
  '> Block quote indented text',
].join('\n');

export function MarkdownShowcase() {
  return (
    <Center width={400}>
      <Markdown>{content}</Markdown>
    </Center>
  );
}
