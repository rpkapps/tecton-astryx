import {Avatar} from '../../Avatar/Avatar.js';
import {AvatarGroup} from '../AvatarGroup.js';
import {AvatarGroupOverflow} from '../../AvatarGroupOverflow/AvatarGroupOverflow.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const MEMBERS = [
  {name: 'Alex Daniels', key: 'alex', href: '/team/alex'},
  {name: 'Ann Smith', key: 'ann', href: '/team/ann'},
  {name: 'Carol Davis', key: 'carol', href: '/team/carol'},
];

const TOTAL_MEMBERS = 18;

export function AvatarGroupInteractive() {
  return (
    <Stack direction="vertical" gap={8}>
      <Stack direction="vertical" gap={3}>
        <Text variant="small" color="secondary">
          Reviewers
        </Text>
        <AvatarGroup size="lg" aria-label="Reviewers">
          {MEMBERS.map(m => (
            <Avatar key={m.key} name={m.name} href={m.href} />
          ))}
          <AvatarGroupOverflow
            count={TOTAL_MEMBERS - MEMBERS.length}
            onClick={() => {}}
          />
        </AvatarGroup>
      </Stack>
      <Stack direction="vertical" gap={3}>
        <Text variant="small" color="secondary">
          Compact, static
        </Text>
        <AvatarGroup size="sm" aria-label="Attendees">
          {MEMBERS.map(m => (
            <Avatar key={m.key} name={m.name} />
          ))}
          <AvatarGroupOverflow count={TOTAL_MEMBERS - MEMBERS.length} />
        </AvatarGroup>
      </Stack>
    </Stack>
  );
}
