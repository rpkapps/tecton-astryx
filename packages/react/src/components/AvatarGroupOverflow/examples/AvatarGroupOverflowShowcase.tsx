import {Avatar} from '../../Avatar/Avatar.js';
import {AvatarGroup} from '../../AvatarGroup/AvatarGroup.js';
import {AvatarGroupOverflow} from '../AvatarGroupOverflow.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const USERS = [
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

export function AvatarGroupOverflowShowcase() {
  return (
    <Stack direction="vertical" gap={8}>
      <Stack direction="vertical" gap={3}>
        <Text variant="small" color="secondary">
          Default overflow
        </Text>
        <AvatarGroup size="lg">
          {USERS.map(user => (
            <Avatar key={user.name} name={user.name} />
          ))}
          <AvatarGroupOverflow count={5} />
        </AvatarGroup>
      </Stack>
      <Stack direction="vertical" gap={3}>
        <Text variant="small" color="secondary">
          Custom count text
        </Text>
        <AvatarGroup size="lg">
          {USERS.slice(0, 2).map(user => (
            <Avatar key={user.name} name={user.name} />
          ))}
          <AvatarGroupOverflow count={12}>12+</AvatarGroupOverflow>
        </AvatarGroup>
      </Stack>
    </Stack>
  );
}
