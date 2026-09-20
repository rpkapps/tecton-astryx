'use client';

import {Avatar} from '@tecton/react/Avatar';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

const NAMES = [
  {name: 'John Doe', note: 'First + last'},
  {name: 'Alice', note: 'Single name'},
  {name: 'Bob Smith Johnson', note: 'Multi-word'},
  {name: 'Dr. Sarah Connor', note: 'Prefixed'},
];

export function AvatarInitialsFallback() {
  return (
    <Stack direction="horizontal" gap={6} vAlign="center">
      {NAMES.map(({name, note}) => (
        <Stack key={name} direction="vertical" gap={2} hAlign="center">
          <Avatar name={name} size="lg" />
          <Text type="supporting" color="secondary">
            {note}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
