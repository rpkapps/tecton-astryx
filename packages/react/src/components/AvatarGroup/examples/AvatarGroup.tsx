import {Avatar} from '../../Avatar/Avatar.js';
import {AvatarGroup} from '../AvatarGroup.js';
import {AvatarGroupOverflow} from '../../AvatarGroupOverflow/AvatarGroupOverflow.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const USERS = [
  {
    name: 'Ami Pena',
    src: '/template-assets/DATA-Ami-Pena.png',
  },
  {
    name: 'Drew Young',
    src: '/template-assets/DATA-Drew-Young.png',
  },
  {
    name: 'Gabriela Fernandez',
    src: '/template-assets/DATA-Gabriela-Fernandez.png',
  },
  {
    name: 'Jihoo Song',
    src: '/template-assets/DATA-Jihoo-Song.png',
  },
  {
    name: 'Nam Tran',
    src: '/template-assets/DATA-Nam-Tran.png',
  },
];

export function AvatarGroupBlock() {
  return (
    <Stack direction="vertical" gap={8}>
      <Stack direction="vertical" gap={3}>
        <Text variant="small" color="secondary">
          Team members
        </Text>
        <AvatarGroup size="lg">
          {USERS.map(user => (
            <Avatar key={user.name} src={user.src} name={user.name} />
          ))}
          <AvatarGroupOverflow count={3} />
        </AvatarGroup>
      </Stack>
      <Stack direction="vertical" gap={3}>
        <Text variant="small" color="secondary">
          Larger group
        </Text>
        <AvatarGroup size="lg">
          {USERS.slice(0, 3).map(user => (
            <Avatar key={user.name} src={user.src} name={user.name} />
          ))}
          <AvatarGroupOverflow count={8} />
        </AvatarGroup>
      </Stack>
    </Stack>
  );
}
