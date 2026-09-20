import {Avatar} from '../../Avatar/Avatar.js';
import {AvatarGroup} from '../AvatarGroup.js';
import {AvatarGroupOverflow} from '../../AvatarGroupOverflow/AvatarGroupOverflow.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const USERS = [
  {
    name: 'Alex Daniels',
    key: 'alex',
  },
  {
    name: 'Ann Smith',
    key: 'ann',
  },
  {
    name: 'Carol Davis',
    key: 'carol',
  },
  {
    name: 'Gina Wilson',
    key: 'gina',
  },
  {
    name: 'Eve Park',
    key: 'eve',
  },
];

export function AvatarGroupShowcase() {
  return (
    <Stack direction="vertical" gap={8}>
      <Stack direction="vertical" gap={3}>
        <Text variant="small" color="secondary">
          Team members
        </Text>
        <AvatarGroup size="lg">
          {USERS.map(u => (
            <Avatar key={u.key} name={u.name} />
          ))}
        </AvatarGroup>
      </Stack>
      <Stack direction="vertical" gap={3}>
        <Text variant="small" color="secondary">
          With overflow
        </Text>
        <AvatarGroup size="lg">
          {USERS.slice(0, 3).map(u => (
            <Avatar key={u.key} name={u.name} />
          ))}
          <AvatarGroupOverflow count={USERS.length - 3} />
        </AvatarGroup>
      </Stack>
    </Stack>
  );
}
