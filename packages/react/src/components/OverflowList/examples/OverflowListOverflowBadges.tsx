import {Badge} from '../../Badge/Badge.js';
import {Card} from '../../Card/Card.js';
import {OverflowList} from '../OverflowList.js';

export function OverflowListOverflowBadges() {
  return (
    <Card padding={2}>
      <OverflowList
        gap={1}
        overflowRenderer={overflowItems => (
          <Badge variant="neutral" label={`+${overflowItems.length}`} />
        )}
      >
        <Badge variant="info" label="React" />
        <Badge variant="success" label="TypeScript" />
        <Badge variant="warning" label="StyleX" />
        <Badge variant="neutral" label="Storybook" />
        <Badge variant="error" label="Vitest" />
      </OverflowList>
    </Card>
  );
}
