'use client';

import {OverflowList} from '@tecton/react/OverflowList';
import {Badge} from '@tecton/react/Badge';
import {Card} from '@tecton/react/Card';

export function OverflowListOverflowBadges() {
  return (
    <Card
      padding={2}
      style={{
        resize: 'horizontal',
        overflow: 'hidden',
        minWidth: 80,
        width: 300,
      }}
    >
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
