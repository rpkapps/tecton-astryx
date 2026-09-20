import {Citation} from '../Citation.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const sources = [
  {
    title: 'React Documentation',
    url: 'https://react.dev',
    icon: 'https://react.dev/favicon-32x32.png',
  },
  {
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/handbook/',
    icon: 'https://www.typescriptlang.org/favicon-32x32.png',
  },
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    icon: 'https://developer.mozilla.org/favicon-48x48.cbbd161b.png',
  },
  {
    title: 'W3C WAI-ARIA Specification',
    url: 'https://www.w3.org/TR/wai-aria/',
  },
];

export function CitationSourceList() {
  return (
    <Stack direction="vertical" gap={3}>
      <Text variant="small" color="secondary">
        Sources
      </Text>
      <Stack direction="horizontal" gap={2}>
        {sources.map((source, i) => (
          <Citation
            key={source.title}
            source={source}
            number={i + 1}
            variant="label"
          />
        ))}
      </Stack>
    </Stack>
  );
}
