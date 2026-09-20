import {Badge} from '../../Badge/Badge.js';
import {Card} from '../../Card/Card.js';
import {OverflowList} from '../OverflowList.js';

const tags = [
  'React',
  'TypeScript',
  'StyleX',
  'Storybook',
  'Vitest',
  'Playwright',
  'ESLint',
  'Prettier',
  'Vite',
  'pnpm',
];

export function OverflowListMultiRowTags() {
  return (
    <Card padding={2}>
      <OverflowList
        gap={1}
        maxRows={2}
        overflowRenderer={overflowItems => (
          <Badge variant="neutral" label={`+${overflowItems.length}`} />
        )}
      >
        {tags.map(tag => (
          <Badge key={tag} variant="info" label={tag} />
        ))}
      </OverflowList>
    </Card>
  );
}
