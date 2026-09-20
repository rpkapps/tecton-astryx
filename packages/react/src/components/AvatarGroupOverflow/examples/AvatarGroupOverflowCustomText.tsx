import {Avatar} from '../../Avatar/Avatar.js';
import {AvatarGroup} from '../../AvatarGroup/AvatarGroup.js';
import {AvatarGroupOverflow} from '../AvatarGroupOverflow.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const TEAM = [
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

export function AvatarGroupOverflowCustomText() {
  return (
    <Stack direction="vertical" gap={3}>
      <Text variant="small" color="secondary">
        Team members
      </Text>
      <AvatarGroup size="lg">
        {TEAM.map(member => (
          <Avatar key={member.name} name={member.name} />
        ))}
        <AvatarGroupOverflow count={12}>12+</AvatarGroupOverflow>
      </AvatarGroup>
    </Stack>
  );
}
