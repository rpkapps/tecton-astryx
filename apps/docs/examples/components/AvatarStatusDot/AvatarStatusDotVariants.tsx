'use client';

import {Avatar, AvatarStatusDot} from '@tecton/react/Avatar';
import {HStack} from '@tecton/react/Layout';

export function AvatarStatusDotVariants() {
  return (
    <HStack gap={4} vAlign="center">
      <Avatar
        name="Ana Silva"
        size="xl"
        status={<AvatarStatusDot variant="success" label="Online" />}
      />
      <Avatar
        name="Ben Okafor"
        size="xl"
        status={<AvatarStatusDot variant="neutral" label="Away" />}
      />
      <Avatar
        name="Cleo Marsh"
        size="xl"
        status={<AvatarStatusDot variant="error" label="Do not disturb" />}
      />
    </HStack>
  );
}
