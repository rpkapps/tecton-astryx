import {Avatar} from '../Avatar.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const USERS = [
  {
    name: 'Itai Jordaan',
    src: '/template-assets/DATA-Itai-Jordaan.png',
    role: 'Engineering Lead',
    variant: 'success' as const,
  },
  {
    name: 'Margot Schroder',
    src: '/template-assets/DATA-Margot-Schroder.png',
    role: 'Product Designer',
    variant: 'neutral' as const,
  },
  {
    name: 'Daniela Gimenez',
    src: '/template-assets/DATA-Daniela-Gimenez.png',
    role: 'Engineering Manager',
    variant: 'error' as const,
  },
];

export function AvatarUserCard() {
  return (
    <Stack direction="vertical" gap={4}>
      {USERS.map(user => (
        <Stack key={user.name} direction="horizontal" gap={3}>
          <Avatar src={user.src} name={user.name} size={40} />
          <Stack direction="vertical" gap={0}>
            <Text variant="medium" weight="bold">
              {user.name}
            </Text>
            <Text variant="small" color="secondary">
              {user.role}
            </Text>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
