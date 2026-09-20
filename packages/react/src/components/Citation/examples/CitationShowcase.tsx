import {Citation} from '../Citation.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

export function CitationShowcase() {
  return (
    <Stack direction="vertical" gap={6}>
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary">
          Label variant
        </Text>
        <Stack direction="horizontal" gap={2}>
          <Citation
            source={{title: 'React Documentation', url: 'https://react.dev'}}
            number={1}
            variant="label"
          />
          <Citation
            source={{
              title: 'GitHub',
              url: 'https://github.com',
              icon: 'https://github.githubassets.com/favicons/favicon.svg',
            }}
            number={2}
            variant="label"
          />
          <Citation
            source={{title: 'Internal reference'}}
            number={3}
            variant="label"
          />
        </Stack>
      </Stack>
      <Stack direction="vertical" gap={2}>
        <Text variant="small" color="secondary">
          Number variant
        </Text>
        <Stack direction="horizontal" gap={2}>
          <Citation
            source={{
              title: 'TypeScript Handbook',
              url: 'https://typescriptlang.org',
            }}
            number={1}
            variant="number"
          />
          <Citation
            source={{
              title: 'MDN Web Docs',
              url: 'https://developer.mozilla.org',
            }}
            number={2}
            variant="number"
          />
          <Citation
            source={{title: 'W3C Specification'}}
            number={3}
            variant="number"
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
