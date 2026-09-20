import {Avatar} from '../../Avatar/Avatar.js';
import {AvatarGroup} from '../../AvatarGroup/AvatarGroup.js';
import {AvatarGroupOverflow} from '../AvatarGroupOverflow.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

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
      <Text variant="small" color="secondary">
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
