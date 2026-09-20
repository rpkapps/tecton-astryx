'use client';

import {Avatar, AvatarStatusDot} from '@tecton/react/Avatar';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

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
        <Stack key={user.name} direction="horizontal" gap={3} vAlign="center">
          <Avatar
            src={user.src}
            name={user.name}
            size="lg"
            status={
              <AvatarStatusDot variant={user.variant} label={user.variant} />
            }
          />
          <Stack direction="vertical" gap={0}>
            <Text type="body" weight="bold">
              {user.name}
            </Text>
            <Text type="supporting" color="secondary">
              {user.role}
            </Text>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
