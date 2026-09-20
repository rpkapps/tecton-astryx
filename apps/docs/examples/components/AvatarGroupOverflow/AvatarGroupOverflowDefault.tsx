'use client';

import {Avatar} from '@tecton/react/Avatar';
import {AvatarGroup, AvatarGroupOverflow} from '@tecton/react/AvatarGroup';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

const REVIEWERS = [
  {
    name: 'Alex Daniels',
  },
  {
    name: 'Ann Smith',
  },
  {
    name: 'Carol Davis',
  },
];

export function AvatarGroupOverflowDefault() {
  return (
    <Stack direction="vertical" gap={3}>
      <Text type="supporting" color="secondary">
        Reviewers
      </Text>
      <AvatarGroup size="lg">
        {REVIEWERS.map(reviewer => (
          <Avatar key={reviewer.name} name={reviewer.name} />
        ))}
        <AvatarGroupOverflow count={2} />
      </AvatarGroup>
    </Stack>
  );
}
